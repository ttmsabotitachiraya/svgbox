import { onBeforeRouteLeave } from "vue-router";

/**
 * Saves the page scroll position to sessionStorage when the user navigates
 * away, and exposes a `restoreScroll()` helper that components call **after**
 * their async data has finished loading.
 *
 * Why sessionStorage instead of relying on Vue Router's `savedPosition`?
 * Vue Router restores the position *before* async content is rendered, so
 * the page height may still be 0 / too small and the browser silently clamps
 * the scroll to 0.  By calling `restoreScroll()` right after `await fetchAll()`
 * the DOM already has its full height and the scroll lands correctly.
 *
 * @param key  A short, stable identifier for this page (e.g. "home", "dashboard").
 */
export function useScrollRestoration(key: string) {
  const STORAGE_KEY = `svgbox_scroll_${key}`;

  /**
   * Restore the saved scroll position.
   * Call this immediately after your async data fetch completes inside
   * `onMounted`.  It is a no-op when there is nothing saved (e.g. on the
   * first visit or after a hard refresh).
   */
  const restoreScroll = () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return;

    const y = parseInt(raw, 10);
    sessionStorage.removeItem(STORAGE_KEY);

    if (isNaN(y) || y <= 0) return;

    // requestAnimationFrame gives Vue one more render cycle to paint the
    // newly loaded cards before we jump to the saved position.
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    });
  };

  // Persist the current scroll position every time the user leaves this route
  // (whether going forward to a detail page or navigating elsewhere).
  onBeforeRouteLeave(() => {
    sessionStorage.setItem(STORAGE_KEY, String(window.scrollY));
  });

  return { restoreScroll };
}
