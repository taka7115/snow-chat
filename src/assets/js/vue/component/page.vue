<template>
    <div class="content" :class="{ 'is-chat': $route.path === '/chat' }">
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
</script>


<style scoped lang="scss">
.content {
    position: relative;
}
</style>