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
                                    id="regTopFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#FFFFFF" />
                                    <stop offset="100%" stop-color="#E9ECEF" />
                                </linearGradient>
                                <linearGradient
                                    id="regLeftFace"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stop-color="#4F4F4F" />
                                    <stop offset="100%" stop-color="#3D3D3D" />
                                </linearGradient>
                                <linearGradient
                                    id="regRightFace"
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
                                fill="url(#regTopFace)"
                                stroke="#DEE2E6"
                                stroke-width="0.5"
                            />
                            <path
                                d="M0 50 L100 100 L100 200 L0 150 Z"
                                fill="url(#regLeftFace)"
                            />
                            <path
                                d="M100 100 L200 50 L200 150 L100 200 Z"
                                fill="url(#regRightFace)"
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

            <!-- Success State -->
            <Transition name="fade-slide">
                <div
                    v-if="successMessage"
                    class="bg-surface rounded-2xl shadow-md border border-border p-8 text-center"
                >
                    <div
                        class="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle :size="32" class="text-accent" />
                    </div>
                    <h2
                        class="text-xl font-semibold text-textprimary font-prompt mb-2"
                    >
                        สมัครสมาชิกสำเร็จ!
                    </h2>
                    <p class="text-sm text-textsecondary font-prompt mb-1">
                        {{ successMessage }}
                    </p>
                    <p class="text-sm text-textsecondary font-prompt mb-6">
                        กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ แล้วเข้าสู่ระบบ
                    </p>
                    <RouterLink
                        to="/login"
                        class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm transition-all duration-200"
                    >
                        <LogIn :size="16" />
                        ไปหน้าเข้าสู่ระบบ
                    </RouterLink>
                </div>
            </Transition>

            <!-- Register Card -->
            <Transition name="fade-slide">
                <div
                    v-if="!successMessage"
                    class="bg-surface rounded-2xl shadow-md border border-border p-8"
                >
                    <div class="mb-6">
                        <h1
                            class="text-2xl font-semibold text-textprimary font-prompt"
                        >
                            {{ t("auth.register.title") }}
                        </h1>
                        <p class="text-sm text-textsecondary font-prompt mt-1">
                            {{ t("auth.register.subtitle") }}
                        </p>
                    </div>

                    <form @submit.prevent="handleRegister" class="space-y-5">
                        <!-- Email -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                {{ t("auth.register.emailLabel") }}
                                <span class="text-red-500">*</span>
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
                                        errors.email
                                            ? 'border-red-400'
                                            : 'border-border focus:border-accent'
                                    "
                                    @blur="validateEmail"
                                />
                            </div>
                            <p
                                v-if="errors.email"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.email }}
                            </p>
                        </div>

                        <!-- Username -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                {{ t("auth.register.usernameLabel") }}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <AtSign
                                    :size="17"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                                />
                                <input
                                    v-model="username"
                                    type="text"
                                    placeholder="your_username"
                                    autocomplete="username"
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                    :class="
                                        errors.username
                                            ? 'border-red-400'
                                            : 'border-border focus:border-accent'
                                    "
                                    @blur="validateUsername"
                                />
                            </div>
                            <p
                                v-if="errors.username"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.username }}
                            </p>
                            <p
                                v-else
                                class="mt-1 text-xs text-textsecondary font-prompt"
                            >
                                {{ t("auth.register.usernameNote") }}
                            </p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                {{ t("auth.register.passwordLabel") }}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <Lock
                                    :size="17"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                                />
                                <input
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    :placeholder="
                                        t('auth.register.passwordPlaceholder')
                                    "
                                    autocomplete="new-password"
                                    required
                                    class="w-full pl-10 pr-10 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                    :class="
                                        errors.password
                                            ? 'border-red-400'
                                            : 'border-border focus:border-accent'
                                    "
                                    @blur="validatePassword"
                                    @input="onPasswordInput"
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
                            <p
                                v-if="errors.password"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.password }}
                            </p>

                            <!-- Password Strength -->
                            <div v-if="password" class="mt-2">
                                <div class="flex gap-1 mb-1">
                                    <div
                                        v-for="i in 4"
                                        :key="i"
                                        class="h-1 flex-1 rounded-full transition-all duration-300"
                                        :class="
                                            i <= passwordStrength.score
                                                ? passwordStrength.color
                                                : 'bg-soft'
                                        "
                                    />
                                </div>
                                <p
                                    class="text-xs font-prompt"
                                    :class="passwordStrength.textColor"
                                >
                                    {{ passwordStrength.label }}
                                </p>
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                {{ t("auth.register.confirmPasswordLabel") }}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <ShieldCheck
                                    :size="17"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                                />
                                <input
                                    v-model="confirmPassword"
                                    :type="
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    "
                                    :placeholder="
                                        t(
                                            'auth.register.confirmPasswordPlaceholder',
                                        )
                                    "
                                    autocomplete="new-password"
                                    required
                                    class="w-full pl-10 pr-10 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                    :class="
                                        errors.confirmPassword
                                            ? 'border-red-400'
                                            : confirmPassword &&
                                                !errors.confirmPassword
                                              ? 'border-accent'
                                              : 'border-border focus:border-accent'
                                    "
                                    @blur="validateConfirmPassword"
                                />
                                <button
                                    type="button"
                                    @click="
                                        showConfirmPassword =
                                            !showConfirmPassword
                                    "
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary hover:text-primary transition-colors"
                                >
                                    <EyeOff
                                        v-if="showConfirmPassword"
                                        :size="17"
                                    />
                                    <Eye v-else :size="17" />
                                </button>
                                <div
                                    v-if="
                                        confirmPassword &&
                                        !errors.confirmPassword
                                    "
                                    class="absolute right-9 top-1/2 -translate-y-1/2"
                                >
                                    <Check :size="16" class="text-accent" />
                                </div>
                            </div>
                            <p
                                v-if="errors.confirmPassword"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.confirmPassword }}
                            </p>
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

                        <!-- Terms notice -->
                        <p
                            class="text-xs text-textsecondary font-prompt text-center"
                        >
                            {{ t("auth.register.terms") }}
                            <span
                                class="text-accent cursor-pointer hover:underline"
                                >{{ t("auth.register.termsLink") }}</span
                            >
                            {{ t("auth.register.and") }}
                            <span
                                class="text-accent cursor-pointer hover:underline"
                                >{{ t("auth.register.privacyLink") }}</span
                            >
                        </p>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            :disabled="isSubmitting || !isFormValid"
                            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Loader2
                                v-if="isSubmitting"
                                :size="17"
                                class="animate-spin"
                            />
                            <UserPlus v-else :size="17" />
                            {{
                                isSubmitting
                                    ? t("auth.register.submitting")
                                    : t("auth.register.submitBtn")
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
                                >{{ t("auth.register.hasAccount") }}</span
                            >
                        </div>
                    </div>

                    <!-- Login Link -->
                    <RouterLink
                        to="/login"
                        class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-border text-sm font-prompt font-medium text-primary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
                    >
                        <LogIn :size="16" />
                        {{ t("auth.register.loginLink") }}
                    </RouterLink>
                </div>
            </Transition>

            <!-- Back to Home -->
            <div class="text-center mt-6">
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-1.5 text-sm font-prompt text-textsecondary hover:text-primary transition-colors duration-200"
                >
                    <ArrowLeft :size="14" />
                    {{ t("auth.register.backToHome") }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "../composables/useI18n";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    LogIn,
    Loader2,
    AlertCircle,
    CheckCircle,
    ShieldCheck,
    Check,
    ArrowLeft,
    AtSign,
} from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { register } = useAuth();
const { t } = useI18n();

const email = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const errors = ref({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
});

// Password strength calculator
const passwordStrength = computed(() => {
    const p = password.value;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;

    const levels = [
        {
            score: 1,
            label: "อ่อนมาก",
            color: "bg-red-400",
            textColor: "text-red-500",
        },
        {
            score: 2,
            label: "อ่อน",
            color: "bg-orange-400",
            textColor: "text-orange-500",
        },
        {
            score: 3,
            label: "ปานกลาง",
            color: "bg-yellow-400",
            textColor: "text-yellow-600",
        },
        {
            score: 4,
            label: "แข็งแกร่ง",
            color: "bg-accent",
            textColor: "text-accent",
        },
    ];

    const level = levels[Math.min(score, 4) - 1] ?? levels[0];
    return { ...level, score };
});

const isFormValid = computed(() => {
    return (
        email.value.trim() !== "" &&
        username.value.trim().length >= 3 &&
        password.value.length >= 6 &&
        confirmPassword.value === password.value &&
        !errors.value.email &&
        !errors.value.username &&
        !errors.value.password &&
        !errors.value.confirmPassword
    );
});

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        errors.value.email = "กรุณากรอกอีเมล";
    } else if (!emailRegex.test(email.value)) {
        errors.value.email = "รูปแบบอีเมลไม่ถูกต้อง";
    } else {
        errors.value.email = "";
    }
};

const validateUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username.value.trim()) {
        errors.value.username = "กรุณากรอก Username";
    } else if (username.value.trim().length < 3) {
        errors.value.username = "Username ต้องมีอย่างน้อย 3 ตัวอักษร";
    } else if (username.value.trim().length > 30) {
        errors.value.username = "Username ต้องไม่เกิน 30 ตัวอักษร";
    } else if (!usernameRegex.test(username.value.trim())) {
        errors.value.username =
            "Username ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _ เท่านั้น";
    } else {
        errors.value.username = "";
    }
};

const validatePassword = () => {
    if (!password.value) {
        errors.value.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.value.length < 6) {
        errors.value.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    } else {
        errors.value.password = "";
    }
    // Re-validate confirm if already touched
    if (confirmPassword.value) {
        validateConfirmPassword();
    }
};

const validateConfirmPassword = () => {
    if (!confirmPassword.value) {
        errors.value.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (confirmPassword.value !== password.value) {
        errors.value.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    } else {
        errors.value.confirmPassword = "";
    }
};

const onPasswordInput = () => {
    if (errors.value.password) validatePassword();
};

const handleRegister = async () => {
    // Run all validations
    validateEmail();
    validateUsername();
    validatePassword();
    validateConfirmPassword();

    if (
        errors.value.email ||
        errors.value.username ||
        errors.value.password ||
        errors.value.confirmPassword
    )
        return;

    isSubmitting.value = true;
    errorMessage.value = "";

    try {
        await register(
            email.value.trim(),
            password.value,
            username.value.trim(),
        );
        successMessage.value = `ส่งอีเมลยืนยันไปที่ ${email.value.trim()} แล้ว`;
        // Optionally auto-redirect after a delay
        setTimeout(() => {
            router.push({ name: "login" });
        }, 5000);
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (
                e.message.includes("already registered") ||
                e.message.includes("already been registered")
            ) {
                errorMessage.value = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น";
            } else if (e.message.includes("Password should be")) {
                errorMessage.value = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
            } else if (
                e.message.includes("unique") ||
                e.message.includes("duplicate") ||
                e.message.includes("already")
            ) {
                errorMessage.value =
                    "Username นี้ถูกใช้งานแล้ว กรุณาเลือก Username ใหม่";
            } else {
                errorMessage.value = e.message;
            }
        } else {
            errorMessage.value = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
        }
    } finally {
        isSubmitting.value = false;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
