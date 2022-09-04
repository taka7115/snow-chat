<template>
  <div class="chatArea">
<chat-message></chat-message>
  </div>
</template>

<script setup lang="ts">
import chatMessage from './chatMessage.vue'

</script>

<style scoped lang="scss">
.chatArea {
  min-height: calc(50vh - 56px);
  height: auto;
  max-height: calc(120vh - 56px);
  overflow: auto;
  padding: 56px 24px calc(104px + 56px);
}
</style>
