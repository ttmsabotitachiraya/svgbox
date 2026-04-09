<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Hero Section -->
            <div class="text-center mb-12">
                <div class="flex justify-center mb-6">
                    <div class="w-20 h-20">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="heroTopFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#FFFFFF" />
                                    <stop offset="100%" stop-color="#E9ECEF" />
                                </linearGradient>
                                <linearGradient
                                    id="heroLeftFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#4F4F4F" />
                                    <stop offset="100%" stop-color="#3D3D3D" />
                                </linearGradient>
                                <linearGradient
                                    id="heroRightFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#26D6D1" />
                                    <stop offset="100%" stop-color="#00CEC9" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M100 0 L200 50 L100 100 L0 50 Z"
                                fill="url(#heroTopFace)"
                                stroke="#DEE2E6"
                                stroke-width="0.5"
                            />
                            <path
                                d="M0 50 L100 100 L100 200 L0 150 Z"
                                fill="url(#heroLeftFace)"
                            />
                            <path
                                d="M100 100 L200 50 L200 150 L100 200 Z"
                                fill="url(#heroRightFace)"
                            />
                            <g
                                transform="translate(100, 50) scale(1.667, 0.833) rotate(45)"
                            >
                                <text
                                    x="0"
                                    y="25"
                                    text-anchor="middle"
                                    font-family="Arial, sans-serif"
                                    font-weight="bold"
                                    font-size="80"
                                    fill="#212529"
                                >
                                    S
                                </text>
                            </g>
                            <g transform="translate(50, 137.5) skewY(26.5)">
                                <text
                                    x="0"
                                    y="0"
                                    text-anchor="middle"
                                    font-family="Arial, sans-serif"
                                    font-weight="bold"
                                    font-size="60"
                                    fill="#FFFFFF"
                                    fill-opacity="0.95"
                                >
                                    V
                                </text>
                            </g>
                            <g transform="translate(150, 137.5) skewY(-26.5)">
                                <text
                                    x="0"
                                    y="0"
                                    text-anchor="middle"
                                    font-family="Arial, sans-serif"
                                    font-weight="bold"
                                    font-size="60"
                                    fill="#FFFFFF"
                                    fill-opacity="0.95"
                                >
                                    G
                                </text>
                            </g>
                        </svg>
                    </div>
                </div>
                <h1
                    class="text-4xl sm:text-5xl font-bold text-primary font-prompt mb-4 leading-tight"
                >
                    SVG<span style="color: #00cec9">B</span>ox
                </h1>
                <p
                    class="text-lg text-textsecondary font-prompt font-light max-w-xl mx-auto mb-8"
                >
                    คลัง SVG สาธารณะ สวยงาม ใช้ได้ทันที
                </p>

                <!-- Large Search Bar -->
                <div class="max-w-2xl mx-auto relative">
                    <Search
                        :size="20"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                    />
                    <input
                        v-model="localSearch"
                        type="text"
                        placeholder="ค้นหา SVG, ชื่อ, แท็ก..."
                        class="w-full pl-12 pr-5 py-4 bg-surface border border-border rounded-2xl text-base font-prompt text-textprimary placeholder-textsecondary shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                        @input="onSearch"
                    />
                    <span
                        v-if="localSearch"
                        class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-textsecondary hover:text-primary transition-colors"
                        @click="clearSearch"
                    >
                        <X :size="18" />
                    </span>
                </div>

                <!-- Stats Row -->
                <div
                    class="flex items-center justify-center gap-6 mt-6 text-sm font-prompt text-textsecondary"
                >
                    <span class="flex items-center gap-1.5">
                        <Layers :size="15" class="text-accent" />
                        {{ totalCount }} SVGs
                    </span>
                    <span class="w-1 h-1 bg-border rounded-full"></span>
                    <span class="flex items-center gap-1.5">
                        <Tag :size="15" class="text-accent" />
                        {{ uniqueCategories.length }} หมวดหมู่
                    </span>
                    <span class="w-1 h-1 bg-border rounded-full"></span>
                    <span class="flex items-center gap-1.5">
                        <Globe :size="15" class="text-accent" />
                        ใช้งานได้ฟรี
                    </span>
                </div>
            </div>

            <!-- Filter Row -->
            <div
                class="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center"
            >
                <!-- Category Filter Buttons -->
                <div class="flex items-center gap-2 flex-wrap">
                    <button
                        @click="selectCategory('')"
                        :class="[
                            'px-4 py-1.5 rounded-full text-sm font-prompt font-medium transition-all duration-200',
                            selectedCategory === ''
                                ? 'bg-accent text-white shadow-sm'
                                : 'bg-surface border border-border text-secondary hover:border-accent hover:text-accent',
                        ]"
                    >
                        ทั้งหมด
                    </button>
                    <button
                        v-for="cat in allCategories"
                        :key="cat"
                        @click="selectCategory(cat)"
                        :class="[
                            'px-4 py-1.5 rounded-full text-sm font-prompt font-medium transition-all duration-200',
                            selectedCategory === cat
                                ? 'bg-accent text-white shadow-sm'
                                : 'bg-surface border border-border text-secondary hover:border-accent hover:text-accent',
                        ]"
                    >
                        {{ cat }}
                    </button>
                </div>

                <!-- Tag Filter -->
                <div class="sm:ml-auto relative min-w-[200px]">
                    <Tag
                        :size="15"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                    />
                    <input
                        v-model="tagFilter"
                        type="text"
                        placeholder="กรองด้วยแท็ก..."
                        class="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                        @input="onTagFilter"
                    />
                </div>
            </div>

            <!-- Active Filters Display -->
            <div
                v-if="selectedCategory || tagFilter || localSearch"
                class="flex items-center gap-2 mb-6 flex-wrap"
            >
                <span class="text-xs font-prompt text-textsecondary"
                    >กำลังกรอง:</span
                >
                <span
                    v-if="localSearch"
                    class="flex items-center gap-1 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-prompt"
                >
                    <Search :size="11" /> "{{ localSearch }}"
                    <button @click="clearSearch" class="ml-1 hover:opacity-70">
                        <X :size="10" />
                    </button>
                </span>
                <span
                    v-if="selectedCategory"
                    class="flex items-center gap-1 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-prompt"
                >
                    <Layers :size="11" /> {{ selectedCategory }}
                    <button
                        @click="selectCategory('')"
                        class="ml-1 hover:opacity-70"
                    >
                        <X :size="10" />
                    </button>
                </span>
                <span
                    v-if="tagFilter"
                    class="flex items-center gap-1 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-prompt"
                >
                    <Tag :size="11" /> {{ tagFilter }}
                    <button @click="clearTag" class="ml-1 hover:opacity-70">
                        <X :size="10" />
                    </button>
                </span>
                <button
                    @click="clearAllFilters"
                    class="text-xs font-prompt text-textsecondary underline hover:text-primary transition-colors"
                >
                    ล้างทั้งหมด
                </button>
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

            <!-- SVG Grid -->
            <div
                v-else-if="filteredAssets.length"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                <SVGCard
                    v-for="asset in filteredAssets"
                    :key="asset.id"
                    :asset="asset"
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
                    ไม่พบ SVG ที่ตรงกัน
                </h3>
                <p class="text-sm text-textsecondary font-prompt max-w-xs">
                    ลองค้นหาด้วยคำอื่น หรือล้างตัวกรองแล้วลองใหม่อีกครั้ง
                </p>
                <button
                    v-if="selectedCategory || tagFilter || localSearch"
                    @click="clearAllFilters"
                    class="mt-5 px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 transition-all duration-200"
                >
                    ล้างตัวกรอง
                </button>
            </div>

            <!-- Toast -->
            <ToastNotification
                v-if="toast.message"
                :message="toast.message"
                :type="toast.type"
                @dismiss="toast.message = ''"
            />
        </div>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Search, X, Layers, Tag, Globe, PackageOpen } from "lucide-vue-next";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import SVGCard from "../components/SVGCard.vue";
import ToastNotification from "../components/ToastNotification.vue";
import { useSvgAssets } from "../composables/useSvgAssets";
import { useAuth } from "../composables/useAuth";
import { useScrollRestoration } from "../composables/useScrollRestoration";

const { assets, loading, fetchAll, toggleFavorite } = useSvgAssets();
const { user, refreshSession } = useAuth();
const { restoreScroll } = useScrollRestoration("home");

const localSearch = ref("");
const selectedCategory = ref("");
const tagFilter = ref("");

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

// Client-side filtering for instant feedback
const filteredAssets = computed(() => {
    let list = assets.value;
    if (localSearch.value.trim()) {
        const q = localSearch.value.toLowerCase();
        list = list.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.tags?.some((t) => t.toLowerCase().includes(q)) ||
                a.category?.toLowerCase().includes(q),
        );
    }
    if (selectedCategory.value) {
        list = list.filter((a) => a.category === selectedCategory.value);
    }
    if (tagFilter.value.trim()) {
        const t = tagFilter.value.toLowerCase();
        list = list.filter((a) =>
            a.tags?.some((tag) => tag.toLowerCase().includes(t)),
        );
    }
    return list;
});

const totalCount = computed(() => assets.value.length);

const uniqueCategories = computed(() => {
    const cats = new Set(assets.value.map((a) => a.category).filter(Boolean));
    return Array.from(cats);
});

const onSearch = () => {
    // client-side filtering via computed
};

const onTagFilter = () => {
    // client-side filtering via computed
};

const selectCategory = (cat: string) => {
    selectedCategory.value = cat;
};

const clearSearch = () => {
    localSearch.value = "";
};

const clearTag = () => {
    tagFilter.value = "";
};

const clearAllFilters = () => {
    localSearch.value = "";
    selectedCategory.value = "";
    tagFilter.value = "";
};

const handleFavorite = async (id: string, current: boolean) => {
    if (!user.value) {
        showToast("กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด", "info");
        return;
    }
    try {
        await toggleFavorite(id, current);
        showToast(
            current ? "ลบออกจากรายการโปรดแล้ว" : "เพิ่มในรายการโปรดแล้ว",
            "success",
        );
        await fetchAll();
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

// Watch the slot's searchQuery if propagated (also handled locally)
watch(localSearch, () => {
    // filtering is reactive via computed
});

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
        await fetchAll();
    } catch {
        // Swallow errors — the page keeps showing whatever data it already has
    } finally {
        isRecovering = false;
    }
};

onMounted(async () => {
    await fetchAll();
    restoreScroll();
    document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>
