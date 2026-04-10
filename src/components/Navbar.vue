<template>
    <nav class="sticky top-0 z-40 bg-surface border-b border-border shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 gap-4">
                <!-- Logo -->
                <RouterLink
                    to="/"
                    class="flex items-center gap-2 shrink-0 group"
                >
                    <div class="w-9 h-9">
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="nbTopFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#FFFFFF" />
                                    <stop offset="100%" stop-color="#E9ECEF" />
                                </linearGradient>
                                <linearGradient
                                    id="nbLeftFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#4F4F4F" />
                                    <stop offset="100%" stop-color="#3D3D3D" />
                                </linearGradient>
                                <linearGradient
                                    id="nbRightFace"
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
                                fill="url(#nbTopFace)"
                                stroke="#DEE2E6"
                                stroke-width="0.5"
                            />
                            <path
                                d="M0 50 L100 100 L100 200 L0 150 Z"
                                fill="url(#nbLeftFace)"
                            />
                            <path
                                d="M100 100 L200 50 L200 150 L100 200 Z"
                                fill="url(#nbRightFace)"
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
                    <span
                        class="font-prompt font-semibold text-xl text-primary group-hover:text-accent transition-colors duration-200"
                    >
                        SVG<span style="color: #00cec9">B</span>ox
                    </span>
                </RouterLink>

                <!-- Right: Auth Actions -->
                <div class="flex items-center gap-2 shrink-0">
                    <!-- Authenticated -->
                    <template v-if="user">
                        <RouterLink
                            :to="{ name: 'collection' }"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-prompt font-medium text-primary hover:bg-soft transition-all duration-200"
                        >
                            <LayoutDashboard :size="16" />
                            <span class="hidden sm:inline relative">
                                Collection
                                <span
                                    v-if="currentPage === 'Collection'"
                                    class="absolute left-0 right-0 -bottom-1 h-[1px] bg-primary"
                                ></span>
                            </span>
                        </RouterLink>
                        <RouterLink
                            v-if="isAdmin"
                            to="/admin"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-prompt font-medium text-purple-600 hover:bg-purple-50 transition-all duration-200"
                        >
                            <ShieldCheck :size="16" class="text-purple-500" />
                            <span
                                class="hidden sm:inline relative text-purple-600"
                            >
                                Admin
                                <span
                                    v-if="currentPage === 'Admin'"
                                    class="absolute left-0 right-0 -bottom-1 h-[1px] bg-purple-600"
                                ></span>
                            </span>
                        </RouterLink>

                        <!-- Profile dropdown trigger -->
                        <div class="relative" ref="profileMenuRef">
                            <button
                                @click="profileMenuOpen = !profileMenuOpen"
                                class="hidden md:flex items-center gap-1.5 text-sm font-prompt text-textsecondary bg-soft hover:bg-accent/10 hover:text-accent px-3 py-1.5 rounded-2xl transition-all duration-200"
                                :title="
                                    user.username
                                        ? `@${user.username}`
                                        : user.email
                                "
                            >
                                <UserCircle2
                                    :size="16"
                                    class="shrink-0 text-accent"
                                />
                                <span
                                    class="max-w-[120px] truncate font-medium"
                                >
                                    {{
                                        user.username
                                            ? `@${user.username}`
                                            : user.email.split("@")[0]
                                    }}
                                </span>
                                <ChevronDown
                                    :size="14"
                                    class="transition-transform duration-200"
                                    :class="profileMenuOpen ? 'rotate-180' : ''"
                                />
                            </button>

                            <!-- Dropdown menu -->
                            <Transition
                                enter-active-class="transition duration-150 ease-out"
                                enter-from-class="opacity-0 scale-95 -translate-y-1"
                                enter-to-class="opacity-100 scale-100 translate-y-0"
                                leave-active-class="transition duration-100 ease-in"
                                leave-from-class="opacity-100 scale-100 translate-y-0"
                                leave-to-class="opacity-0 scale-95 -translate-y-1"
                            >
                                <div
                                    v-if="profileMenuOpen"
                                    class="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-2xl shadow-lg overflow-hidden z-50"
                                >
                                    <!-- User info header -->
                                    <div
                                        class="px-4 py-3 border-b border-border bg-soft/50"
                                    >
                                        <p
                                            class="text-xs font-prompt text-textsecondary"
                                        >
                                            เข้าสู่ระบบในฐานะ
                                        </p>
                                        <p
                                            class="text-sm font-prompt font-semibold text-textprimary truncate mt-0.5"
                                        >
                                            {{
                                                user.username
                                                    ? `@${user.username}`
                                                    : user.email
                                            }}
                                        </p>
                                    </div>
                                    <!-- Menu items -->
                                    <div class="py-1">
                                        <RouterLink
                                            v-if="user.username"
                                            :to="`/profile/${user.username}`"
                                            @click="profileMenuOpen = false"
                                            class="flex items-center gap-2.5 px-4 py-2.5 text-sm font-prompt text-textprimary hover:bg-soft hover:text-accent transition-colors duration-150"
                                        >
                                            <UserCircle2 :size="15" />
                                            โปรไฟล์ของฉัน
                                        </RouterLink>
                                        <RouterLink
                                            to="/settings"
                                            @click="profileMenuOpen = false"
                                            class="flex items-center gap-2.5 px-4 py-2.5 text-sm font-prompt text-textprimary hover:bg-soft hover:text-accent transition-colors duration-150"
                                        >
                                            <Settings :size="15" />
                                            ตั้งค่าโปรไฟล์
                                        </RouterLink>
                                    </div>
                                    <div class="border-t border-border py-1">
                                        <button
                                            @click="handleLogout"
                                            :disabled="loggingOut"
                                            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-prompt text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50"
                                        >
                                            <LogOut :size="15" />
                                            ออกจากระบบ
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Mobile: direct logout button -->
                        <button
                            @click="handleLogout"
                            :disabled="loggingOut"
                            class="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-prompt font-medium text-secondary hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                        >
                            <LogOut :size="16" />
                        </button>
                    </template>

                    <!-- Guest -->
                    <template v-else>
                        <RouterLink
                            to="/login"
                            class="px-4 py-2 rounded-2xl text-sm font-prompt font-medium text-primary border border-border hover:border-accent hover:text-accent transition-all duration-200"
                        >
                            เข้าสู่ระบบ
                        </RouterLink>
                        <RouterLink
                            to="/register"
                            class="px-4 py-2 rounded-2xl text-sm font-prompt font-medium bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            สมัครสมาชิก
                        </RouterLink>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserCircle2,
    ChevronDown,
    Settings,
} from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const { user, logout, isAdmin } = useAuth();

const route = useRoute();
const currentPage = computed(() => {
    if (route.path.startsWith("/admin")) return "Admin";
    if (route.path.startsWith("/collection")) return "Collection";
    if (route.path.startsWith("/profile")) return "Profile";
    if (route.path.startsWith("/settings")) return "Settings";
    return "";
});

const loggingOut = ref(false);
const profileMenuOpen = ref(false);
const profileMenuRef = ref<HTMLElement | null>(null);

const handleLogout = async () => {
    profileMenuOpen.value = false;
    loggingOut.value = true;
    try {
        await logout();
    } finally {
        loggingOut.value = false;
    }
};

// Close dropdown when clicking outside
const handleOutsideClick = (e: MouseEvent) => {
    if (
        profileMenuRef.value &&
        !profileMenuRef.value.contains(e.target as Node)
    ) {
        profileMenuOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleOutsideClick);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
