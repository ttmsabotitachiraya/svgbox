import { ref } from "vue";
import { supabase } from "../services/supabase";
import type { SvgAsset } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
//  Singleton state — shared across every component that calls useFavorites()
// ─────────────────────────────────────────────────────────────────────────────
const favoriteIds = ref<Set<string>>(new Set());
const favoriteAssets = ref<SvgAsset[]>([]);
const favLoading = ref(false);

// ─────────────────────────────────────────────────────────────────────────────
//  Composable
// ─────────────────────────────────────────────────────────────────────────────
export function useFavorites() {
  /** Check if a given asset is in the current user's favorites */
  const isFavorited = (assetId: string): boolean => {
    return favoriteIds.value.has(assetId);
  };

  /**
   * Load just the asset IDs that the current user has favorited.
   * Lightweight — used by pages that only need to know the heart state.
   */
  const fetchFavoriteIds = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("svgbox_favorites")
        .select("asset_id")
        .eq("user_id", userId);

      if (error) throw error;
      favoriteIds.value = new Set(
        (data ?? []).map((f: { asset_id: string }) => f.asset_id),
      );
    } catch {
      favoriteIds.value = new Set();
    }
  };

  /**
   * Load full asset objects that the current user has favorited.
   * Used by the "รายการโปรด" tab in DashboardPage.
   * Attaches creator profile info (no N+1).
   */
  const fetchFavoriteAssets = async (userId: string): Promise<void> => {
    favLoading.value = true;
    try {
      // Step 1: get asset IDs + created_at from svgbox_favorites
      const { data: favRows, error: favErr } = await supabase
        .from("svgbox_favorites")
        .select("asset_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (favErr) throw favErr;

      const ids: string[] = (favRows ?? []).map(
        (f: { asset_id: string; created_at: string }) => f.asset_id,
      );

      if (ids.length === 0) {
        favoriteAssets.value = [];
        favoriteIds.value = new Set();
        return;
      }

      // Step 2: get full asset data
      const { data: assetRows, error: assetErr } = await supabase
        .from("svgbox_assets")
        .select("*")
        .in("id", ids);

      if (assetErr) throw assetErr;

      const assetList = (assetRows ?? []) as SvgAsset[];

      // Step 3: attach creator profiles (single batched query)
      const userIds = [...new Set(assetList.map((a) => a.user_id))];
      const { data: profiles } = await supabase
        .from("svgbox_profiles")
        .select("id, username, display_name")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map(
          (p: {
            id: string;
            username: string | null;
            display_name: string | null;
          }) => [
            p.id,
            { id: p.id, username: p.username, display_name: p.display_name },
          ],
        ),
      );

      // Preserve the favorites order (newest first)
      const orderedIds = ids;
      const assetMap = new Map(assetList.map((a) => [a.id, a]));

      favoriteAssets.value = orderedIds
        .map((id) => assetMap.get(id))
        .filter((a): a is SvgAsset => !!a)
        .map((a) => ({
          ...a,
          creator: profileMap.get(a.user_id) ?? null,
        }));

      // Keep favoriteIds in sync
      favoriteIds.value = new Set(ids);
    } catch {
      favoriteAssets.value = [];
    } finally {
      favLoading.value = false;
    }
  };

  /** Add an asset to the current user's favorites */
  const addFavorite = async (
    userId: string,
    assetId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from("svgbox_favorites")
      .insert({ user_id: userId, asset_id: assetId });

    if (error) {
      // 23505 = unique_violation — already favorited, treat as success
      if (error.code !== "23505") throw error;
    }
    favoriteIds.value = new Set([...favoriteIds.value, assetId]);
  };

  /** Remove an asset from the current user's favorites */
  const removeFavorite = async (
    userId: string,
    assetId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from("svgbox_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("asset_id", assetId);

    if (error) throw error;
    const newSet = new Set(favoriteIds.value);
    newSet.delete(assetId);
    favoriteIds.value = newSet;
  };

  /**
   * Toggle favorite for an asset.
   * Adds to svgbox_favorites if not already favorited, removes if already favorited.
   * Works for ANY asset — own or other users'.
   */
  const toggleFavorite = async (
    userId: string,
    assetId: string,
  ): Promise<void> => {
    if (isFavorited(assetId)) {
      await removeFavorite(userId, assetId);
    } else {
      await addFavorite(userId, assetId);
    }
  };

  return {
    favoriteIds,
    favoriteAssets,
    favLoading,
    isFavorited,
    fetchFavoriteIds,
    fetchFavoriteAssets,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
