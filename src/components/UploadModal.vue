<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4"
                @click.self="handleClose"
            >
                <div
                    class="bg-surface rounded-2xl shadow-xl w-full max-w-lg font-prompt"
                >
                    <!-- Header -->
                    <div
                        class="flex items-center justify-between p-6 border-b border-border"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center"
                            >
                                <Upload :size="18" class="text-accent" />
                            </div>
                            <h2
                                class="text-lg font-semibold text-textprimary font-prompt"
                            >
                                อัปโหลด SVG
                            </h2>
                        </div>
                        <button
                            @click="handleClose"
                            class="p-2 rounded-xl text-textsecondary hover:text-primary hover:bg-soft transition-all duration-200"
                        >
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
                        <!-- Name -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                ชื่อ SVG <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.name"
                                type="text"
                                placeholder="เช่น Beautiful Flower Icon"
                                class="w-full px-4 py-2.5 bg-bg border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                :class="
                                    errors.name
                                        ? 'border-red-400'
                                        : 'border-border focus:border-accent'
                                "
                            />
                            <p
                                v-if="errors.name"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.name }}
                            </p>
                        </div>

                        <!-- SVG Code / File Drop -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                SVG Code <span class="text-red-500">*</span>
                            </label>

                            <!-- Drop Zone -->
                            <div
                                class="relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer"
                                :class="[
                                    isDragging
                                        ? 'border-accent bg-accent/5 scale-[1.01]'
                                        : errors.svg_code
                                          ? 'border-red-400 bg-bg'
                                          : 'border-border bg-bg hover:border-accent/60 hover:bg-accent/5',
                                ]"
                                @dragover.prevent="isDragging = true"
                                @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleDrop"
                                @click="triggerFileInput"
                            >
                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept=".svg"
                                    class="hidden"
                                    @change="handleFileChange"
                                />

                                <div
                                    v-if="!form.svg_code"
                                    class="flex flex-col items-center justify-center py-8 px-4 text-center pointer-events-none"
                                >
                                    <div
                                        class="w-12 h-12 rounded-xl bg-soft flex items-center justify-center mb-3"
                                    >
                                        <FileUp
                                            :size="22"
                                            class="text-textsecondary"
                                        />
                                    </div>
                                    <p
                                        class="text-sm font-medium text-textprimary font-prompt"
                                    >
                                        ลาก & วาง ไฟล์ .svg ที่นี่
                                    </p>
                                    <p
                                        class="text-xs text-textsecondary mt-1 font-prompt"
                                    >
                                        หรือคลิกเพื่อเลือกไฟล์
                                    </p>
                                </div>

                                <div v-else class="p-3 pointer-events-none">
                                    <div class="flex items-center gap-2 mb-2">
                                        <FileCheck
                                            :size="16"
                                            class="text-accent shrink-0"
                                        />
                                        <span
                                            class="text-xs text-accent font-prompt font-medium truncate"
                                            >ไฟล์โหลดแล้ว -
                                            คลิกเพื่อเปลี่ยน</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Textarea for pasting -->
                            <div class="mt-2">
                                <label
                                    class="block text-xs text-textsecondary mb-1 font-prompt"
                                    >หรือวาง SVG Code โดยตรง:</label
                                >
                                <textarea
                                    v-model="form.svg_code"
                                    rows="4"
                                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
                                    class="w-full px-3 py-2.5 bg-bg border rounded-xl text-xs font-mono text-textprimary placeholder-textsecondary focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none transition-all duration-200"
                                    :class="
                                        errors.svg_code
                                            ? 'border-red-400'
                                            : 'border-border focus:border-accent'
                                    "
                                    @click.stop
                                />
                            </div>
                            <p
                                v-if="errors.svg_code"
                                class="mt-1 text-xs text-red-500 font-prompt"
                            >
                                {{ errors.svg_code }}
                            </p>
                        </div>

                        <!-- Live SVG Preview -->
                        <Transition name="preview">
                            <div
                                v-if="form.svg_code && previewHtml"
                                class="rounded-xl border border-border bg-bg p-4"
                            >
                                <p
                                    class="text-xs font-medium text-textsecondary mb-2 font-prompt flex items-center gap-1.5"
                                >
                                    <Eye :size="13" /> ตัวอย่าง
                                </p>
                                <div
                                    class="flex items-center justify-center h-32 bg-surface rounded-lg overflow-hidden"
                                    v-html="previewHtml"
                                />
                            </div>
                        </Transition>

                        <!-- Tags -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                            >
                                แท็ก
                                <span
                                    class="text-xs font-normal text-textsecondary"
                                    >(คั่นด้วยจุลภาค)</span
                                >
                            </label>
                            <input
                                v-model="tagsInput"
                                type="text"
                                placeholder="เช่น icon, nature, flower"
                                class="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-sm font-prompt text-textprimary placeholder-textsecondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                                @input="parseTags"
                            />
                            <!-- Tag chips -->
                            <div
                                v-if="form.tags.length"
                                class="flex flex-wrap gap-1.5 mt-2"
                            >
                                <span
                                    v-for="tag in form.tags"
                                    :key="tag"
                                    class="flex items-center gap-1 bg-soft text-textsecondary rounded-full px-2.5 py-0.5 text-xs font-prompt"
                                >
                                    {{ tag }}
                                    <button
                                        type="button"
                                        @click="removeTag(tag)"
                                        class="hover:text-primary transition-colors"
                                    >
                                        <X :size="10" />
                                    </button>
                                </span>
                            </div>
                        </div>

                        <!-- Category -->
                        <div>
                            <label
                                class="block text-sm font-medium text-textprimary mb-1.5 font-prompt"
                                >หมวดหมู่</label
                            >
                            <div class="relative">
                                <select
                                    v-model="form.category"
                                    class="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-sm font-prompt text-textprimary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 appearance-none transition-all duration-200 pr-10"
                                >
                                    <option value="">
                                        -- เลือกหมวดหมู่ --
                                    </option>
                                    <option
                                        v-for="cat in categories"
                                        :key="cat"
                                        :value="cat"
                                    >
                                        {{ cat }}
                                    </option>
                                </select>
                                <ChevronDown
                                    :size="16"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary pointer-events-none"
                                />
                            </div>
                        </div>

                        <!-- Error -->
                        <div
                            v-if="submitError"
                            class="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                        >
                            <AlertCircle
                                :size="16"
                                class="text-red-500 shrink-0 mt-0.5"
                            />
                            <p class="text-sm text-red-600 font-prompt">
                                {{ submitError }}
                            </p>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-3 pt-1">
                            <button
                                type="button"
                                @click="handleClose"
                                class="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-prompt font-medium text-secondary hover:bg-soft transition-all duration-200"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                :disabled="isSubmitting"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-prompt font-medium hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Loader2
                                    v-if="isSubmitting"
                                    :size="16"
                                    class="animate-spin"
                                />
                                <Save v-else :size="16" />
                                {{ isSubmitting ? "กำลังบันทึก..." : "บันทึก" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
    Upload,
    X,
    FileUp,
    FileCheck,
    Eye,
    ChevronDown,
    AlertCircle,
    Loader2,
    Save,
} from "lucide-vue-next";
import { useSvgAssets } from "../composables/useSvgAssets";
import { sanitizeSvg } from "../utils/svgUtils";

const props = defineProps<{
    modelValue: boolean;
    userId: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    uploaded: [];
}>();

const { create } = useSvgAssets();

const categories = ["Illustration", "Icon", "Logo", "Animation", "Other"];

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const tagsInput = ref("");

const form = ref({
    name: "",
    svg_code: "",
    tags: [] as string[],
    category: "",
});

const errors = ref({
    name: "",
    svg_code: "",
});

const previewHtml = computed(() => {
    if (!form.value.svg_code) return "";
    const cleaned = sanitizeSvg(form.value.svg_code);
    return cleaned.replace(
        /<svg/i,
        '<svg style="max-width:100%;max-height:120px;width:auto;height:auto;"',
    );
});

const triggerFileInput = () => {
    fileInput.value?.click();
};

const readSvgFile = (file: File) => {
    if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
        submitError.value = "กรุณาเลือกไฟล์ .svg เท่านั้น";
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        form.value.svg_code = content;
        errors.value.svg_code = "";
        submitError.value = null;
    };
    reader.readAsText(file);
};

const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) readSvgFile(file);
};

const handleDrop = (e: DragEvent) => {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) readSvgFile(file);
};

const parseTags = () => {
    form.value.tags = tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
};

const removeTag = (tag: string) => {
    form.value.tags = form.value.tags.filter((t) => t !== tag);
    tagsInput.value = form.value.tags.join(", ");
};

const validate = (): boolean => {
    errors.value = { name: "", svg_code: "" };
    let valid = true;
    if (!form.value.name.trim()) {
        errors.value.name = "กรุณาระบุชื่อ SVG";
        valid = false;
    }
    if (!form.value.svg_code.trim()) {
        errors.value.svg_code = "กรุณาใส่ SVG Code หรืออัปโหลดไฟล์";
        valid = false;
    } else if (!form.value.svg_code.includes("<svg")) {
        errors.value.svg_code = "SVG Code ไม่ถูกต้อง ต้องมี <svg> tag";
        valid = false;
    }
    return valid;
};

const handleSubmit = async () => {
    if (!validate()) return;
    isSubmitting.value = true;
    submitError.value = null;
    let saved = false;
    try {
        await create({
            user_id: props.userId,
            name: form.value.name.trim(),
            svg_code: sanitizeSvg(form.value.svg_code),
            tags: form.value.tags,
            category: form.value.category || "Other",
            is_favorite: false,
        });
        saved = true;
        emit("uploaded");
    } catch (e: unknown) {
        submitError.value =
            e instanceof Error ? e.message : "เกิดข้อผิดพลาด กรุณาลองใหม่";
    } finally {
        isSubmitting.value = false;
    }
    // Close only after isSubmitting is false so handleClose guard doesn't block it
    if (saved) handleClose();
};

const resetForm = () => {
    form.value = { name: "", svg_code: "", tags: [], category: "" };
    errors.value = { name: "", svg_code: "" };
    tagsInput.value = "";
    submitError.value = null;
    isDragging.value = false;
    if (fileInput.value) fileInput.value.value = "";
};

const handleClose = () => {
    if (isSubmitting.value) return;
    resetForm();
    emit("update:modelValue", false);
};

// Reset when modal opens
watch(
    () => props.modelValue,
    (val) => {
        if (val) resetForm();
    },
);
</script>

<style scoped>
.modal-enter-active {
    animation: modalIn 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.modal-leave-active {
    animation: modalOut 0.2s ease-in forwards;
}

@keyframes modalIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes modalOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.preview-enter-active,
.preview-leave-active {
    transition: all 0.25s ease;
}
.preview-enter-from,
.preview-leave-to {
    opacity: 0;
    transform: scaleY(0.95);
}
</style>
