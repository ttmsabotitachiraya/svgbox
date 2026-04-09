<template>
    <div class="min-h-screen bg-bg font-prompt">
        <Navbar />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
</script>
