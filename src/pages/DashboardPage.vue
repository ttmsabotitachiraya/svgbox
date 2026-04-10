<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-prompt">
            <!-- Header Row -->
            <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
                <div>
                    <h1
                        class="text-2xl font-semibold text-textprimary font-prompt"
                    >
                        สวัสดี,
                        <span class="text-accent">{{ displayName }}</span>
                    </h1>
                    <p class="text-sm text-textsecondary font-prompt mt-1">
                        จัดการ SVG ของคุณทั้งหมดที่นี่
                    </p>
                </div>

                <button
                    @click="uploadModalOpen = true"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <Plus :size="18" />
                    อัปโหลด SVG ใหม่
                </button>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div
                    class="bg-surface rounded-2xl border border-border p-4 shadow-sm"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"
                        >
                            <Layers :size="18" class="text-accent" />
                        </div>
                        <div>
                            <p
                                class="text-2xl font-semibold text-textprimary font-prompt"
                            >
                                {{ assets.length }}
                            </p>
                            <p class="text-xs text-textsecondary font-prompt">
                                SVG ทั้งหมด
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-surface rounded-2xl border border-border p-4 shadow-sm"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"
                        >
                            <Heart :size="18" class="text-red-400" />
                        </div>
                        <div>
                            <p
                                class="text-2xl font-semibold text-textprimary font-prompt"
                            >
                                {{ favoriteCount }}
                            </p>
                            <p class="text-xs text-textsecondary font-prompt">
                                รายการโปรด
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-surface rounded-2xl border border-border p-4 shadow-sm"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-soft flex items-center justify-center"
                        >
                            <Tag :size="18" class="text-secondary" />
                        </div>
                        <div>
                            <p
                                class="text-2xl font-semibold text-textprimary font-prompt"
                            >
                                {{ uniqueCategories.length }}
                            </p>
                            <p class="text-xs text-textsecondary font-prompt">
                                หมวดหมู่
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-surface rounded-2xl border border-border p-4 shadow-sm"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-soft flex items-center justify-center"
                        >
                            <Hash :size="18" class="text-secondary" />
                        </div>
                        <div>
                            <p
                                class="text-2xl font-semibold text-textprimary font-prompt"
                            >
                                {{ uniqueTagCount }}
                            </p>
                            <p class="text-xs text-textsecondary font-prompt">
                                แท็กทั้งหมด
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filter & Search Row -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
                <!-- Search -->
                <div class="relative flex-1">
                    <Search
                        :size="16"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="ค้นหา SVG ของคุณ..."
                        class="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                    />
                </div>

                <!-- Category Filter -->
                <div class="relative">
                    <select
                        v-model="selectedCategory"
                        class="pl-4 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm font-prompt text-textprimary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 appearance-none transition-all duration-200 min-w-[160px]"
                    >
                        <option value="">ทุกหมวดหมู่</option>
                        <option
                            v-for="cat in allCategories"
                            :key="cat"
                            :value="cat"
                        >
                            {{ cat }}
                        </option>
                    </select>
                    <ChevronDown
                        :size="14"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                    />
                </div>

                <!-- Sort -->
                <div class="relative">
                    <select
                        v-model="sortOrder"
                        class="pl-4 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm font-prompt text-textprimary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 appearance-none transition-all duration-200 min-w-[160px]"
                    >
                        <option value="newest">ใหม่สุด</option>
                        <option value="oldest">เก่าสุด</option>
                        <option value="name">ชื่อ (A-Z)</option>
                        <option value="favorites">รายการโปรด</option>
                    </select>
                    <ChevronDown
                        :size="14"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                    />
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div
                v-if="loading"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                <div
                    v-for="i in 8"
                    :key="i"
                    class="bg-surface rounded-2xl border border-border p-4 animate-pulse"
                >
                    <div class="w-full h-32 bg-soft rounded-xl mb-3"></div>
                    <div class="h-4 bg-soft rounded-full w-3/4 mb-2"></div>
                    <div class="h-3 bg-soft rounded-full w-1/2"></div>
                </div>
            </div>

            <!-- Error State -->
            <div
                v-else-if="error"
                class="flex flex-col items-center justify-center py-20 text-center"
            >
                <div
                    class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4"
                >
                    <AlertCircle :size="28" class="text-red-400" />
                </div>
                <h3 class="text-lg font-semibold text-primary font-prompt mb-1">
                    เกิดข้อผิดพลาด
                </h3>
                <p class="text-sm text-textsecondary font-prompt mb-5">
                    {{ error }}
                </p>
                <button
                    @click="loadAssets()"
                    class="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 transition-all duration-200"
                >
                    ลองใหม่
                </button>
            </div>

            <!-- SVG Grid -->
            <div
                v-else-if="filteredAssets.length"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                <SVGCard
                    v-for="asset in filteredAssets"
                    :key="asset.id"
                    :asset="asset"
                    :current-user-id="user?.id"
                    @favorite="handleFavorite"
                    @download="handleDownload"
                    @copy="handleCopy"
                />
            </div>

            <!-- Empty State -->
            <div
                v-else
                class="flex flex-col items-center justify-center py-24 text-center"
            >
                <div
                    class="w-20 h-20 rounded-2xl bg-soft flex items-center justify-center mb-5"
                >
                    <PackageOpen :size="36" class="text-textsecondary" />
                </div>
                <h3 class="text-xl font-semibold text-primary font-prompt mb-2">
                    {{
                        sortOrder === "favorites" &&
                        !(searchQuery || selectedCategory)
                            ? "ยังไม่มีรายการโปรด"
                            : searchQuery || selectedCategory
                              ? "ไม่พบ SVG ที่ตรงกัน"
                              : "ยังไม่มี SVG"
                    }}
                </h3>
                <p class="text-sm text-textsecondary font-prompt max-w-xs mb-6">
                    {{
                        sortOrder === "favorites" &&
                        !(searchQuery || selectedCategory)
                            ? "คุณยังไม่มี SVG ในรายการโปรด — กลับไปที่คอลเลกชันและกดรูปหัวใจที่ SVG เพื่อเพิ่มรายการโปรด"
                            : searchQuery || selectedCategory
                              ? "ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง"
                              : "เริ่มต้นด้วยการอัปโหลด SVG แรกของคุณ แล้วจัดระเบียบคอลเลกชันของคุณ"
                    }}
                </p>
                <button
                    v-if="
                        !searchQuery &&
                        !selectedCategory &&
                        sortOrder !== 'favorites'
                    "
                    @click="uploadModalOpen = true"
                    class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <Plus :size="18" />
                    อัปโหลด SVG แรกของคุณ
                </button>
                <button
                    v-else-if="
                        sortOrder === 'favorites' &&
                        !searchQuery &&
                        !selectedCategory
                    "
                    @click="sortOrder = 'newest'"
                    class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    ดูทั้งหมด
                </button>
                <button
                    v-else
                    @click="
                        clearFilters();
                        sortOrder = 'newest';
                    "
                    class="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 transition-all duration-200"
                >
                    ล้างตัวกรอง
                </button>
            </div>
        </div>

        <!-- Upload Modal -->
        <UploadModal
            v-if="user"
            v-model="uploadModalOpen"
            :user-id="user.id"
            @uploaded="handleUploaded"
        />

        <!-- Toast -->
        <ToastNotification
            v-if="toast.message"
            :message="toast.message"
            :type="toast.type"
            @dismiss="toast.message = ''"
        />
    </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
    Plus,
    Layers,
    Heart,
    Tag,
    Hash,
    Search,
    ChevronDown,
    AlertCircle,
    PackageOpen,
} from "lucide-vue-next";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import SVGCard from "../components/SVGCard.vue";
import UploadModal from "../components/UploadModal.vue";
import ToastNotification from "../components/ToastNotification.vue";
import { useAuth } from "../composables/useAuth";
import { useSvgAssets } from "../composables/useSvgAssets";
import { useScrollRestoration } from "../composables/useScrollRestoration";

const { user, refreshSession } = useAuth();
const { assets, loading, error, fetchByUser, toggleFavorite } = useSvgAssets();
const { restoreScroll } = useScrollRestoration("dashboard");

const uploadModalOpen = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const sortOrder = ref("newest");

const allCategories = ["Illustration", "Icon", "Logo", "Animation", "Other"];

const toast = ref<{ message: string; type: "success" | "error" | "info" }>({
    message: "",
    type: "success",
});

const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
) => {
    toast.value = { message, type };
};

const displayName = computed(() => {
    if (!user.value) return "ผู้ใช้";
    if (user.value.username) return `@${user.value.username}`;
    if (user.value.email) return user.value.email.split("@")[0];
    return "ผู้ใช้";
});

const favoriteCount = computed(
    () => assets.value.filter((a) => a.is_favorite).length,
);

const uniqueCategories = computed(() => {
    const cats = new Set(assets.value.map((a) => a.category).filter(Boolean));
    return Array.from(cats);
});

const uniqueTagCount = computed(() => {
    const tags = new Set(assets.value.flatMap((a) => a.tags ?? []));
    return tags.size;
});

const filteredAssets = computed(() => {
    let list = [...assets.value];

    // Search filter
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.tags?.some((t) => t.toLowerCase().includes(q)) ||
                a.category?.toLowerCase().includes(q),
        );
    }

    // Category filter
    if (selectedCategory.value) {
        list = list.filter((a) => a.category === selectedCategory.value);
    }

    // Sort and when "favorites" is selected, show only favorite items
    if (sortOrder.value === "favorites") {
        // Filter to favorites only
        list = list.filter((a) => a.is_favorite);
        // Keep newest-first ordering by default
        list.sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );
    } else {
        switch (sortOrder.value) {
            case "newest":
                list.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                );
                break;
            case "oldest":
                list.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime(),
                );
                break;
            case "name":
                list.sort((a, b) => a.name.localeCompare(b.name, "th"));
                break;
        }
    }

    return list;
});

const clearFilters = () => {
    searchQuery.value = "";
    selectedCategory.value = "";
};

const loadAssets = async (restorePosition = false) => {
    // Ensure the auth session is refreshed before attempting to load
    // user-specific assets. This helps when the page is reloaded and the
    // in-memory `user` may not yet be populated even though a session
    // exists in storage.
    if (!user.value) {
        try {
            await refreshSession();
        } catch {
            // Ignore refresh errors here; fetchByUser will simply not run
            // if the user is not available.
        }
    }

    if (user.value) {
        await fetchByUser(user.value.id);
        if (restorePosition) restoreScroll();
    }
};

const handleUploaded = async () => {
    showToast("อัปโหลด SVG สำเร็จ!", "success");
    await loadAssets();
};

const handleFavorite = async (id: string, current: boolean) => {
    try {
        await toggleFavorite(id, current);
        showToast(
            current ? "ลบออกจากรายการโปรดแล้ว" : "เพิ่มในรายการโปรดแล้ว",
            "success",
        );
        await loadAssets();
    } catch {
        showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    }
};

const handleDownload = () => {
    showToast("ดาวน์โหลด SVG สำเร็จ", "success");
};

const handleCopy = () => {
    showToast("คัดลอก SVG Code แล้ว", "success");
};

// Re-fetch when the user switches back to this tab.
// The sequence is critical: refresh the auth token FIRST (so the JWT stored
// in Supabase is valid), THEN fetch data.  Without this ordering the fetch
// races with the token refresh and may send an expired JWT → RLS blocks the
// query → the page appears frozen with stale/empty data.
// The concurrency guard (`isRecovering`) prevents rapid-fire calls when some
// browsers emit multiple visibilitychange events in quick succession.
let isRecovering = false;
const handleVisibilityChange = async () => {
    if (document.visibilityState !== "visible") return;
    if (isRecovering) return;
    isRecovering = true;
    try {
        await refreshSession();
        await loadAssets();
    } catch {
        // Swallow errors — the page keeps showing whatever data it already has
    } finally {
        isRecovering = false;
    }
};

onMounted(async () => {
    // Refresh the auth session first so that `user.value` is populated
    // and the Supabase client holds a fresh JWT before fetching assets.
    try {
        await refreshSession();
    } catch {
        // If refresh times out or fails, we still attempt to load assets.
        // The fallback in loadAssets will handle the absence of user.
    }

    await loadAssets(true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>
