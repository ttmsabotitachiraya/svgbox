<template>
    <Teleport to="body">
        <Transition name="toast">
            <div
                v-if="visible"
                :class="[
                    'fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg font-prompt text-sm font-medium min-w-[220px] max-w-xs',
                    typeClasses,
                ]"
            >
                <component :is="icon" :size="18" class="shrink-0" />
                <span>{{ message }}</span>
                <button
                    @click="dismiss"
                    class="ml-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <X :size="14" />
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { CheckCircle, AlertCircle, Info, X } from "lucide-vue-next";

const props = withDefaults(
    defineProps<{
        message: string;
        type?: "success" | "error" | "info";
        duration?: number;
    }>(),
    {
        type: "info",
        duration: 3000,
    },
);

const emit = defineEmits<{
    dismiss: [];
}>();

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const typeClasses = computed(() => {
    switch (props.type) {
        case "success":
            return "bg-accent text-white";
        case "error":
            return "bg-red-500 text-white";
        case "info":
        default:
            return "bg-primary text-white";
    }
});

const icon = computed(() => {
    switch (props.type) {
        case "success":
            return CheckCircle;
        case "error":
            return AlertCircle;
        case "info":
        default:
            return Info;
    }
});

const dismiss = () => {
    visible.value = false;
    emit("dismiss");
};

const show = () => {
    visible.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        dismiss();
    }, props.duration);
};

watch(
    () => props.message,
    (val) => {
        if (val) show();
    },
    { immediate: true },
);

onUnmounted(() => {
    if (timer) clearTimeout(timer);
});

defineExpose({ show, dismiss });
</script>

<style scoped>
.toast-enter-active {
  animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  animation: slideOut 0.25s ease-in forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}
</style>
