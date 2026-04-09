import { ref, computed } from "vue";
import { supabase } from "../services/supabase";
import type { User } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
//  Singleton state — shared across every component that calls useAuth()
//  Defined at module level so it is created ONCE for the lifetime of the app.
// ─────────────────────────────────────────────────────────────────────────────
const user = ref<User | null>(null);

// Track whether the very first session check has completed.
// Components can use this to avoid rendering protected UI before we know
// whether the visitor is logged in or not.
const authReady = ref(false);

// ─────────────────────────────────────────────────────────────────────────────
//  Internal helpers (module-level, not recreated per call)
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch role + username from svgbox_profiles for a given user id. */
async function _fetchUserProfile(userId: string): Promise<{
  role: "user" | "admin";
  username: string | null;
}> {
  try {
    const { data } = await supabase
      .from("svgbox_profiles")
      .select("role, username")
      .eq("id", userId)
      .single();
    return {
      role: (data?.role as "user" | "admin") ?? "user",
      username: data?.username ?? null,
    };
  } catch {
    // Column may not exist yet (migration pending) — default to safe values
    return { role: "user", username: null };
  }
}

/** Fire-and-forget: record the current timestamp in svgbox_profiles. */
async function _updateLastSeen(): Promise<void> {
  try {
    await supabase.rpc("svgbox_update_last_seen");
  } catch {
    // Non-critical — silently ignore (function may not exist yet)
  }
}

/**
 * Resolve full user object (id + email + role + username) from an auth session user.
 * Sets the module-level `user` ref.
 */
async function _applySession(
  authUser: { id: string; email?: string } | null,
): Promise<void> {
  if (!authUser) {
    user.value = null;
    return;
  }
  const { role, username } = await _fetchUserProfile(authUser.id);
  user.value = {
    id: authUser.id,
    email: authUser.email ?? "",
    role,
    username,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Auth listener — registered ONCE when the module is first imported.
//
//  ⚠️  CRITICAL: This callback must NOT be async / must not await long-running
//  work inline.  Supabase gotrue-js v2 holds an internal navigator.lock while
//  the onAuthStateChange callback executes.  If we await a DB query here
//  (like _applySession → _fetchUserProfile), the lock is held for the entire
//  duration of that query.  Any concurrent call to getSession() (e.g. from
//  refreshSession(), router guards, or ensureFreshSession()) will try to
//  acquire the same lock and DEADLOCK — the browser tab freezes completely.
//
//  FIX: We set a minimal synchronous user stub immediately (so guards and UI
//  have something to work with) and then fire _applySession as a detached
//  promise (no await) to enrich the user with role/username in the background.
//  This releases the internal lock instantly.
// ─────────────────────────────────────────────────────────────────────────────
supabase.auth.onAuthStateChange((event, session) => {
  // ── Synchronous, non-blocking work only ──────────────────────────────
  if (session?.user) {
    // Set a minimal user object immediately so that `user.value` is truthy
    // for router guards and UI checks.  The full profile (role, username)
    // will be patched in asynchronously below.
    const currentUser = user.value;
    if (!currentUser || currentUser.id !== session.user.id) {
      user.value = {
        id: session.user.id,
        email: session.user.email ?? "",
        role: currentUser?.id === session.user.id ? currentUser.role : "user",
        username:
          currentUser?.id === session.user.id ? currentUser.username : null,
      };
    }

    // Fire-and-forget: enrich the user object with role + username from the
    // DB profile.  This does NOT block the callback, so the internal lock is
    // released immediately.
    void _applySession(session.user).catch(() => {
      // Swallow — _applySession already has its own try/catch.
    });

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      // Update last_seen_at; fire-and-forget
      void _updateLastSeen();
    }
  } else {
    user.value = null;
  }

  // Mark auth as ready after the first event (INITIAL_SESSION) has been
  // processed so that router guards and protected pages don't flash while
  // we're still resolving the session.
  if (event === "INITIAL_SESSION") {
    authReady.value = true;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  refreshSession()
//
//  Proactively refresh the Supabase JWT so that subsequent REST / RLS queries
//  carry a valid, non-expired token.
//
//  WHY a timeout?
//  Supabase gotrue-js v2 uses the browser `navigator.locks` API to coordinate
//  token refreshes across tabs.  When a tab is backgrounded the browser may
//  suspend timer callbacks; the lock that was acquired before the tab was
//  hidden can remain held indefinitely.  When the tab returns to the
//  foreground, `getSession()` tries to acquire the same lock and may hang
//  forever waiting for the stale lock to be released.
//
//  By racing `getSession()` against a 5-second timeout we guarantee the
//  caller always gets a result:
//    - Happy path  → token refreshed, all subsequent queries use a valid JWT.
//    - Timeout     → we proceed with whatever token is currently in storage.
//                    Queries may still succeed (token not yet expired, or the
//                    table allows anon access).  If they fail, the UI shows an
//                    error instead of hanging forever.
//
//  IMPORTANT: We intentionally do NOT register a module-level
//  `visibilitychange` listener here.  The old approach had a listener in this
//  file AND in every page component — both firing at the same instant.  The
//  page handler would start fetching data with the OLD (expired) token while
//  this handler was still refreshing it.  By removing the listener here and
//  letting each page call `await refreshSession()` first, we guarantee serial
//  execution: refresh token → THEN fetch data.
// ─────────────────────────────────────────────────────────────────────────────
async function refreshSession(): Promise<void> {
  // ── Step 1: Try to refresh the session with a hard timeout ───────────
  let sessionData: { session: unknown } | null = null;

  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error("session refresh timeout")), 5000),
      ),
    ]);
    sessionData = result?.data ?? null;
  } catch {
    // Timeout or network error — proceed with whatever session exists.
    // If the token is truly expired, subsequent queries will fail with an
    // RLS error, which the UI can display.  This is strictly better than
    // hanging forever.
  }

  // ── Step 2: If we got a result, check if the session is still valid ──
  // If we timed out above (sessionData is null), we do NOT call getSession()
  // a second time — that was the old bug.  The second call had no timeout
  // and would deadlock identically, making the first timeout useless.
  if (sessionData && !(sessionData as { session: unknown }).session) {
    // Session object came back but with no active session — the user is
    // logged out (refresh token expired, signed out in another tab, etc.).
    // Clear local state so the UI reacts immediately.
    user.value = null;
    return;
  }

  // If we timed out, do a lightweight non-blocking check by reading from
  // localStorage directly instead of calling getSession() again.
  if (!sessionData) {
    try {
      // Supabase stores the session in localStorage under a predictable key.
      // Reading from localStorage is synchronous and can't deadlock.
      const storageKey = `sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split(".")[0]}-auth-token`;
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        // No session in storage at all — user is logged out.
        user.value = null;
      }
      // If raw exists, we assume the session is still valid (or will be
      // refreshed by the next successful getSession() call).  The
      // onAuthStateChange listener will catch up eventually.
    } catch {
      // localStorage not available or URL parse error — leave user as-is.
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Composable — thin wrapper that exposes reactive state + actions.
//  Safe to call from multiple components; no extra subscriptions are created.
// ─────────────────────────────────────────────────────────────────────────────
export function useAuth() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** True when the current user has role === 'admin'. */
  const isAdmin = computed(() => user.value?.role === "admin");

  /**
   * Explicitly re-fetch the session and refresh `user`.
   * Useful after operations that might change the user's profile
   * (e.g. role promotion, username update) without triggering an auth event.
   */
  const fetchUser = async (): Promise<void> => {
    try {
      const { data } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<never>((_resolve, reject) =>
          setTimeout(() => reject(new Error("getUser timeout")), 5000),
        ),
      ]);
      await _applySession(data.user ?? null);
    } catch {
      // Timeout or network error — leave user as-is.
      // This prevents the UI from freezing when navigator.locks deadlocks
      // after a tab has been backgrounded and resumed.
    }
  };

  /**
   * Sign in with email + password.
   * Awaits `fetchUser()` so that `user.value` is guaranteed to be populated
   * before the caller (e.g. LoginPage) redirects to a protected route.
   */
  const login = async (email: string, password: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) throw err;

      // onAuthStateChange (SIGNED_IN) will update user asynchronously, but we
      // also call fetchUser() here so the caller can rely on user.value being
      // set synchronously before it navigates away.
      await fetchUser();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Login failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new account.
   * Passes username + display_name in metadata so the DB trigger can set them
   * on svgbox_profiles immediately.
   * Does NOT sign the user in automatically.
   */
  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            display_name: username.trim(),
          },
        },
      });
      if (err) throw err;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Registration failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign out.
   * Sets user to null immediately for instant UI feedback; the
   * onAuthStateChange SIGNED_OUT event will also fire shortly after.
   */
  const logout = async (): Promise<void> => {
    user.value = null; // optimistic — instant UI update
    await supabase.auth.signOut();
  };

  return {
    user,
    authReady,
    loading,
    error,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    refreshSession,
  };
}
