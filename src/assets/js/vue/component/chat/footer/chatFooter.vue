<template>
  <div class="chatFooter">
    <div class="chatFooter__inner">
      <textarea name="commentArea" id="commentArea" class="chatFooter__commentArea" rows="1" ref="textarea"></textarea>
      <button type="button" class="chatFooter__commentBtn" @click="updateMessageList(); emptyTextarea();">
        <svg xmlns="http://www.w3.org/2000/svg" width="11.472" height="13.766" viewBox="0 0 11.472 13.766">
          <path d="M6,0l6,10H0Z" transform="translate(10.5 0.883) rotate(90)" fill="none" stroke="#fff"
            stroke-linecap="round" stroke-width="1"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, inject } from "vue";
// Ref
const textarea: Ref<HTMLTextAreaElement> = ref(null);
// Inject
const $globalProps: any = inject('$globalProps');
const $apiClient: any = inject("$apiClient");
// Variable
const roomName = $globalProps.$myClient.room[$globalProps.$myClient.roomIndex];

// Type
type MessageType = {
  'clientId': boolean
  'user': string | null | undefined,
  'text': string | null | undefined,
  'time': string | null | undefined,
}

/**
 * socket.io_emit
 * @returns {void}
 */
const updateMessageList = () => {
  const time = new Date();
  const hour = time.getHours();
  const hourText = hour.toString().padStart(2, '0');
  const min = time.getMinutes();
  const minText = min.toString().padStart(2, '0');
  const timeText = `${hourText}:${minText}`;
  const newMessage: MessageType = {
    'clientId': $globalProps.$myClient.id,
    'user': $globalProps.$myClient.userList[$globalProps.$myClient.userIndex],
    'text': textarea.value.value,
    'time': timeText
  }
  console.log('newMessage');
  console.table(newMessage);
  $apiClient.putChatMessage(roomName, newMessage);
}

/**
 * empty textarea
 * @returns {void}
 */
const emptyTextarea = () => {
  textarea.value.value = '';
}
</script>

<style scoped lang="scss">
.chatFooter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  &__inner {
    display: grid;
    grid-template-columns: minmax(auto, 320px) auto;
    column-gap: 12px;
    justify-content: center;
    padding: 32px 24px;
    background-color: rgba(255, 255, 255, .3);
    backdrop-filter: blur(3px);
  }

  &__commentArea {
    padding: 6px 16px;
    border-radius: 10em;
    border: 2px solid $color-01;
    background-color: #fff;
    box-shadow: 0 0 4px $color-05;
    resize: none;
    outline: none;
    @include fs(16);
    transition: box-shadow .3s;

    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px $color-05;
    }
  }

  &__commentBtn {
    width: 40px;
    height: 40px;
    background-color: $color-01;
    border-radius: 50%;
    box-shadow: 0 0 4px $color-05;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: box-shadow .3s;

    svg {
      margin-left: 4px;
    }

    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px $color-05;
    }
  }
}
</style>
