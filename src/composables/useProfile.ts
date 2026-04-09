import { ref } from "vue";
import { supabase } from "../services/supabase";
import type { Profile, SvgAsset } from "../types";

export function useProfile() {
  const profile = ref<Profile | null>(null);
  const profileAssets = ref<SvgAsset[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ── READ ──────────────────────────────────────────────────────────────────

  /** Fetch a public profile by username (for profile pages) */
  const fetchProfileByUsername = async (
    username: string,
  ): Promise<Profile | null> => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("svgbox_profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (err) throw err;
      profile.value = data as Profile;
      return data as Profile;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "ไม่พบผู้ใช้";
      profile.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /** Fetch a profile by user id (for settings / own profile) */
  const fetchProfileById = async (id: string): Promise<Profile | null> => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("svgbox_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (err) throw err;
      profile.value = data as Profile;
      return data as Profile;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "ไม่พบโปรไฟล์";
      profile.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch all public SVG assets that belong to a given user.
   * Used on the public profile page to display the designer's gallery.
   */
  const fetchProfileAssets = async (userId: string): Promise<void> => {
    try {
      const { data, error: err } = await supabase
        .from("svgbox_assets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (err) throw err;
      profileAssets.value = (data ?? []) as SvgAsset[];
    } catch {
      profileAssets.value = [];
    }
  };

  // ── WRITE ─────────────────────────────────────────────────────────────────

  /**
   * Update the current user's own profile fields.
   * Passes null explicitly for contact fields so the user can clear them.
   */
  const updateProfile = async (
    id: string,
    updates: Partial<
      Pick<
        Profile,
        | "username"
        | "display_name"
        | "bio"
        | "phone"
        | "website"
        | "twitter"
        | "instagram"
        | "github"
      >
    >,
  ): Promise<void> => {
    const { error: err } = await supabase
      .from("svgbox_profiles")
      .update(updates)
      .eq("id", id);

    if (err) {
      // Surface a friendly message for unique-constraint violations on username
      if (
        err.message?.toLowerCase().includes("unique") ||
        err.message?.toLowerCase().includes("duplicate") ||
        err.code === "23505"
      ) {
        throw new Error(
          "Username นี้ถูกใช้งานแล้ว กรุณาเลือก Username ใหม่",
        );
      }
      throw err;
    }

    // Optimistically update local profile ref
    if (profile.value) {
      profile.value = { ...profile.value, ...updates };
    }
  };

  /**
   * Check whether a given username is available (not taken by another user).
   * Returns true if available.
   */
  const checkUsernameAvailable = async (
    username: string,
    currentUserId?: string,
  ): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from("svgbox_profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (!data) return true; // No one has this username
      if (currentUserId && data.id === currentUserId) return true; // It's the current user's own username
      return false;
    } catch {
      return true; // Optimistic fallback
    }
  };

  return {
    profile,
    profileAssets,
    loading,
    error,
    fetchProfileByUsername,
    fetchProfileById,
    fetchProfileAssets,
    updateProfile,
    checkUsernameAvailable,
  };
}
