<template>
<div class="mv" :style="{ 'background-image': 'url(' + backgroundImage + ')' }">
<CurrentSelectedUser></CurrentSelectedUser>
</div>
</template>

<script setup lang="ts">
import CurrentSelectedUser from './user/currentSelectedUser.vue'

const backgroundImage:string = '/assets/img/bg-mountain.svg';
</script>

<style scoped lang="scss">
.mv {
  height: 350px;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: $color-01;
  display: flex;
  justify-content: center;
  align-items:center;
}
</style>
