<template>
    <div
        class="min-h-screen bg-bg flex items-center justify-center px-4 font-prompt"
    >
        <div class="w-full max-w-md">
            <!-- Logo + Brand -->
            <div class="text-center mb-8">
                <RouterLink
                    to="/"
                    class="inline-flex flex-col items-center gap-3 group"
                >
                    <div class="w-16 h-16">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="loginTopFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#FFFFFF" />
                                    <stop offset="100%" stop-color="#E9ECEF" />
                                </linearGradient>
                                <linearGradient
                                    id="loginLeftFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#4F4F4F" />
                                    <stop offset="100%" stop-color="#3D3D3D" />
                                </linearGradient>
                                <linearGradient
                                    id="loginRightFace"
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
                                fill="url(#loginTopFace)"
                                stroke="#DEE2E6"
                                stroke-width="0.5"
                            />
                            <path
                                d="M0 50 L100 100 L100 200 L0 150 Z"
                                fill="url(#loginLeftFace)"
                            />
                            <path
                                d="M100 100 L200 50 L200 150 L100 200 Z"
                                fill="url(#loginRightFace)"
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
                        class="text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-200 font-prompt"
                    >
                        SVG<span style="color: #00cec9">B</span>ox
                    </span>
                </RouterLink>
            </div>

            <!-- Card -->
            <div
                class="bg-surface rounded-2xl shadow-md border border-border p-8"
            >
                <div class="mb-6">
                    <h1
                        class="text-2xl font-semibold text-textprimary font-prompt"
                    >
                        {{ t("auth.login.title") }}
                    </h1>
                    <p class="text-sm text-textsecondary font-prompt mt-1">
                        {{ t("auth.login.subtitle") }}
                    </p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <!-- Email -->
                    <div>
                        <label
                            class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                        >
                            {{ t("auth.login.emailLabel") }}
                        </label>
                        <div class="relative">
                            <Mail
                                :size="17"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                            />
                            <input
                                v-model="email"
                                type="email"
                                placeholder="your@email.com"
                                autocomplete="email"
                                required
                                class="w-full pl-10 pr-4 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                :class="
                                    fieldError
                                        ? 'border-red-400'
                                        : 'border-border focus:border-accent'
                                "
                            />
                        </div>
                    </div>

                    <!-- Password -->
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label
                                class="block text-sm font-medium text-textprimary font-prompt"
                            >
                                {{ t("auth.login.passwordLabel") }}
                            </label>
                        </div>
                        <div class="relative">
                            <Lock
                                :size="17"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                            />
                            <input
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="••••••••"
                                autocomplete="current-password"
                                required
                                class="w-full pl-10 pr-10 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                :class="
                                    fieldError
                                        ? 'border-red-400'
                                        : 'border-border focus:border-accent'
                                "
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary hover:text-primary transition-colors"
                            >
                                <EyeOff v-if="showPassword" :size="17" />
                                <Eye v-else :size="17" />
                            </button>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <Transition name="error-fade">
                        <div
                            v-if="errorMessage"
                            class="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                        >
                            <AlertCircle
                                :size="16"
                                class="text-red-500 shrink-0 mt-0.5"
                            />
                            <p class="text-sm text-red-600 font-prompt">
                                {{ errorMessage }}
                            </p>
                        </div>
                    </Transition>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Loader2
                            v-if="loading"
                            :size="17"
                            class="animate-spin"
                        />
                        <LogIn v-else :size="17" />
                        {{
                            loading
                                ? t("auth.login.submitting")
                                : t("auth.login.submitBtn")
                        }}
                    </button>
                </form>

                <!-- Divider -->
                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-border"></div>
                    </div>
                    <div class="relative flex justify-center text-xs">
                        <span
                            class="bg-surface px-3 text-textsecondary font-prompt"
                            >{{ t("auth.login.noAccount") }}</span
                        >
                    </div>
                </div>

                <!-- Register Link -->
                <RouterLink
                    to="/register"
                    class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-border text-sm font-prompt font-medium text-primary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
                >
                    <UserPlus :size="16" />
                    {{ t("auth.login.registerLink") }}
                </RouterLink>
            </div>

            <!-- Back to Home -->
            <div class="text-center mt-6">
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-1.5 text-sm font-prompt text-textsecondary hover:text-primary transition-colors duration-200"
                >
                    <ArrowLeft :size="14" />
                    {{ t("auth.login.backToHome") }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { useI18n } from "../composables/useI18n";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    AlertCircle,
    UserPlus,
    ArrowLeft,
} from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login, loading } = useAuth();
const { t } = useI18n();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const fieldError = ref(false);

const handleLogin = async () => {
    errorMessage.value = "";
    fieldError.value = false;

    if (!email.value.trim() || !password.value) {
        errorMessage.value = t("auth.login.errors.emptyFields");
        fieldError.value = true;
        return;
    }

    try {
        await login(email.value.trim(), password.value);
        router.push({ name: "collection" });
    } catch (e: unknown) {
        fieldError.value = true;
        if (e instanceof Error) {
            if (e.message.includes("Invalid login credentials")) {
                errorMessage.value = t("auth.login.errors.invalidCreds");
            } else if (e.message.includes("Email not confirmed")) {
                errorMessage.value = t("auth.login.errors.emailNotConfirmed");
            } else {
                errorMessage.value = e.message;
            }
        } else {
            errorMessage.value = t("auth.login.errors.generic");
        }
    }
};
</script>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
    transition: all 0.25s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
