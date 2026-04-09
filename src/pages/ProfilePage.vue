<template>
    <DefaultLayout>
        <div class="max-w-5xl mx-auto px-4 py-8">
            <!-- Loading -->
            <div v-if="loading" class="space-y-6">
                <div class="bg-surface rounded-2xl border border-border p-8 animate-pulse">
                    <div class="flex items-start gap-6">
                        <div class="w-20 h-20 rounded-full bg-soft shrink-0" />
                        <div class="flex-1 space-y-3">
                            <div class="h-6 bg-soft rounded-xl w-48" />
                            <div class="h-4 bg-soft rounded-xl w-32" />
                            <div class="h-4 bg-soft rounded-xl w-72" />
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div v-for="i in 8" :key="i" class="bg-surface rounded-2xl border border-border h-48 animate-pulse" />
                </div>
            </div>

            <!-- Not Found -->
            <div
                v-else-if="!profile"
                class="flex flex-col items-center justify-center py-24 text-center"
            >
                <div class="w-16 h-16 rounded-full bg-soft flex items-center justify-center mb-4">
                    <UserX :size="28" class="text-textsecondary" />
                </div>
                <h2 class="text-xl font-semibold text-textprimary font-prompt mb-2">
                    ไม่พบผู้ใช้งาน
                </h2>
                <p class="text-sm text-textsecondary font-prompt mb-6">
                    ไม่พบโปรไฟล์สำหรับ @{{ route.params.username }}
                </p>
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 transition-all duration-200"
                >
                    <Home :size="16" />
                    กลับหน้าแรก
                </RouterLink>
            </div>

            <!-- Profile Content -->
            <div v-else class="space-y-8">
                <!-- Profile Card -->
                <div class="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                    <!-- Cover gradient bar -->
                    <div class="h-3 bg-gradient-to-r from-accent via-accent/70 to-primary/40" />

                    <div class="p-6 sm:p-8">
                        <div class="flex flex-col sm:flex-row items-start gap-5">
                            <!-- Avatar (initial-based) -->
                            <div class="shrink-0">
                                <div
                                    class="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md"
                                    :style="{ background: avatarGradient }"
                                >
                                    {{ avatarInitial }}
                                </div>
                            </div>

                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 class="text-xl font-semibold text-textprimary font-prompt">
                                        {{ profile.display_name || profile.username }}
                                    </h1>
                                    <span
                                        v-if="profile.role === 'admin'"
                                        class="inline-flex items-center gap-1 text-xs font-prompt text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200"
                                    >
                                        <ShieldCheck :size="11" />
                                        Admin
                                    </span>
                                </div>
                                <p class="text-sm font-prompt text-textsecondary mb-3">
                                    @{{ profile.username }}
                                </p>
                                <p
                                    v-if="profile.bio"
                                    class="text-sm font-prompt text-textprimary leading-relaxed mb-4 max-w-lg"
                                >
                                    {{ profile.bio }}
                                </p>

                                <!-- Contact Links Row -->
                                <div class="flex flex-wrap items-center gap-3">
                                    <!-- Website -->
                                    <a
                                        v-if="profile.website"
                                        :href="normalizeUrl(profile.website)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1.5 text-xs font-prompt text-textsecondary hover:text-accent transition-colors duration-150"
                                    >
                                        <Globe :size="13" />
                                        <span class="truncate max-w-[160px]">{{ displayUrl(profile.website) }}</span>
                                    </a>

                                    <!-- GitHub -->
                                    <a
                                        v-if="profile.github"
                                        :href="`https://github.com/${profile.github}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1.5 text-xs font-prompt text-textsecondary hover:text-accent transition-colors duration-150"
                                    >
                                        <Github :size="13" />
                                        <span>{{ profile.github }}</span>
                                    </a>

                                    <!-- Twitter / X -->
                                    <a
                                        v-if="profile.twitter"
                                        :href="`https://twitter.com/${profile.twitter}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1.5 text-xs font-prompt text-textsecondary hover:text-accent transition-colors duration-150"
                                    >
                                        <Twitter :size="13" />
                                        <span>@{{ profile.twitter }}</span>
                                    </a>

                                    <!-- Instagram -->
                                    <a
                                        v-if="profile.instagram"
                                        :href="`https://instagram.com/${profile.instagram}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1.5 text-xs font-prompt text-textsecondary hover:text-accent transition-colors duration-150"
                                    >
                                        <Instagram :size="13" />
                                        <span>@{{ profile.instagram }}</span>
                                    </a>

                                    <!-- Phone -->
                                    <a
                                        v-if="profile.phone"
                                        :href="`tel:${profile.phone}`"
                                        class="inline-flex items-center gap-1.5 text-xs font-prompt text-textsecondary hover:text-accent transition-colors duration-150"
                                    >
                                        <Phone :size="13" />
                                        <span>{{ profile.phone }}</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Action: Edit Profile (own profile) or Settings shortcut -->
                            <div v-if="isOwnProfile" class="shrink-0">
                                <RouterLink
                                    to="/settings"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-prompt text-textprimary hover:border-accent hover:text-accent transition-all duration-200"
                                >
                                    <Pencil :size="14" />
                                    แก้ไขโปรไฟล์
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Stats row -->
                        <div class="flex items-center gap-4 mt-5 pt-5 border-t border-border">
                            <div class="text-center">
                                <p class="text-xl font-bold text-textprimary font-prompt">
                                    {{ profileAssets.length }}
                                </p>
                                <p class="text-xs text-textsecondary font-prompt">SVG</p>
                            </div>
                            <div class="w-px h-8 bg-border" />
                            <div class="text-center">
                                <p class="text-xl font-bold text-textprimary font-prompt">
                                    {{ totalViews }}
                                </p>
                                <p class="text-xs text-textsecondary font-prompt">Views</p>
                            </div>
                            <div class="w-px h-8 bg-border" />
                            <div class="flex items-center gap-1.5 text-xs text-textsecondary font-prompt">
                                <CalendarDays :size="13" />
                                เข้าร่วม {{ joinedDate }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SVG Gallery Section -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-semibold text-textprimary font-prompt flex items-center gap-2">
                            <Layers :size="16" class="text-accent" />
                            SVG ของ {{ profile.display_name || profile.username }}
                        </h2>
                        <span class="text-xs font-prompt text-textsecondary bg-soft px-2.5 py-1 rounded-full">
                            {{ filteredAssets.length }} รายการ
                        </span>
                    </div>

                    <!-- Filter bar -->
                    <div v-if="profileAssets.length > 0" class="flex flex-wrap gap-2 mb-4">
                        <button
                            @click="selectedCategory = ''"
                            :class="[
                                'px-3 py-1.5 rounded-xl text-xs font-prompt transition-all duration-150',
                                selectedCategory === ''
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-soft text-textsecondary hover:bg-accent/10 hover:text-accent',
                            ]"
                        >
                            ทั้งหมด
                        </button>
                        <button
                            v-for="cat in uniqueCategories"
                            :key="cat"
                            @click="selectedCategory = cat"
                            :class="[
                                'px-3 py-1.5 rounded-xl text-xs font-prompt transition-all duration-150',
                                selectedCategory === cat
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-soft text-textsecondary hover:bg-accent/10 hover:text-accent',
                            ]"
                        >
                            {{ cat }}
                        </button>
                    </div>

                    <!-- SVG Grid -->
                    <div
                        v-if="filteredAssets.length > 0"
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                    >
                        <SVGCard
                            v-for="asset in filteredAssets"
                            :key="asset.id"
                            :asset="asset"
                            @favorite="() => {}"
                            @download="() => {}"
                            @copy="() => {}"
                        />
                    </div>

                    <!-- Empty state -->
                    <div
                        v-else-if="!assetsLoading"
                        class="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div class="w-12 h-12 rounded-full bg-soft flex items-center justify-center mb-3">
                            <PackageOpen :size="22" class="text-textsecondary" />
                        </div>
                        <p class="text-sm font-prompt text-textsecondary">
                            {{ selectedCategory ? `ไม่มี SVG ในหมวด "${selectedCategory}"` : 'ยังไม่มี SVG ที่อัปโหลด' }}
                        </p>
                        <button
                            v-if="selectedCategory"
                            @click="selectedCategory = ''"
                            class="mt-3 text-xs font-prompt text-accent hover:underline"
                        >
                            ล้างตัวกรอง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import {
    UserX,
    Home,
    Globe,
    Phone,
    Pencil,
    Layers,
    PackageOpen,
    ShieldCheck,
    CalendarDays,
    Twitter,
    Instagram,
    Github,
} from "lucide-vue-next";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import SVGCard from "../components/SVGCard.vue";
import { useProfile } from "../composables/useProfile";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const { user } = useAuth();
const { profile, profileAssets, loading, fetchProfileByUsername, fetchProfileAssets } = useProfile();

const assetsLoading = ref(false);
const selectedCategory = ref("");

// ── Computed ──────────────────────────────────────────────────────────────

const isOwnProfile = computed(() => {
    return user.value && profile.value && user.value.id === profile.value.id;
});

const avatarInitial = computed(() => {
    const name = profile.value?.display_name || profile.value?.username || "?";
    return name.charAt(0).toUpperCase();
});

/** Generate a deterministic gradient based on username */
const avatarGradient = computed(() => {
    const name = profile.value?.username || "user";
    const palettes = [
        "linear-gradient(135deg, #00cec9, #0984e3)",
        "linear-gradient(135deg, #6c5ce7, #a29bfe)",
        "linear-gradient(135deg, #fd79a8, #e84393)",
        "linear-gradient(135deg, #00b894, #00cec9)",
        "linear-gradient(135deg, #e17055, #fdcb6e)",
        "linear-gradient(135deg, #74b9ff, #0984e3)",
        "linear-gradient(135deg, #55efc4, #00b894)",
        "linear-gradient(135deg, #fab1a0, #e17055)",
    ];
    const idx =
        name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
        palettes.length;
    return palettes[idx];
});

const uniqueCategories = computed(() => {
    const cats = new Set(profileAssets.value.map((a) => a.category).filter(Boolean));
    return Array.from(cats);
});

const filteredAssets = computed(() => {
    if (!selectedCategory.value) return profileAssets.value;
    return profileAssets.value.filter((a) => a.category === selectedCategory.value);
});

const totalViews = computed(() =>
    profileAssets.value.reduce((sum, a) => sum + (a.view_count ?? 0), 0),
);

const joinedDate = computed(() => {
    if (!profile.value?.created_at) return "—";
    try {
        return new Intl.DateTimeFormat("th-TH", {
            year: "numeric",
            month: "long",
        }).format(new Date(profile.value.created_at));
    } catch {
        return "—";
    }
});

// ── URL helpers ────────────────────────────────────────────────────────────

const normalizeUrl = (url: string): string => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;
};

const displayUrl = (url: string): string => {
    try {
        const u = new URL(normalizeUrl(url));
        return u.hostname + (u.pathname !== "/" ? u.pathname : "");
    } catch {
        return url;
    }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────

onMounted(async () => {
    const username = route.params.username as string;
    const found = await fetchProfileByUsername(username);
    if (found) {
        assetsLoading.value = true;
        try {
            await fetchProfileAssets(found.id);
        } finally {
            assetsLoading.value = false;
        }
    }
});
</script>
