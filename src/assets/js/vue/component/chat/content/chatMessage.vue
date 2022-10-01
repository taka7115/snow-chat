<template>
  <div class="chatMessage" v-for="item in messageList" :key="item.time"
    :class="{ 'is-mine': checkIfMessageIsMine(item) }">
    <div class="chatMessage__item">
      <div class="chatMessage__user">
        <span class="chatMessage__userName">{{ item.user.name }}</span>
        <div class="chatMessage__userImg">
          <img :src="item.user.path || defaultImg" alt="" />
        </div>
      </div>
      <div class="chatMessage__comment">
        <p class="chatMessage__commentText">{{ item.text }}</p>
      </div>
      <time class="chatMessage__time" :datetime="item.time">{{
      item.time
      }}</time>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, inject, reactive, ref, Ref, isReactive } from "vue";

// Inject
const $globalProps: any = inject("$globalProps");
const $apiClient: any = inject("$apiClient");
// Variable
const roomName = $globalProps.$myClient.room[$globalProps.$myClient.roomIndex];
const defaultImg = "/assets/img/img-user-01.jpg";

// Type
type MessageType = {
  clientId: boolean;
  user: any;
  text: string | null | undefined;
  time: string | null | undefined;
};

// reflect queryGetRoomInfo
let messageList = ref<Array<MessageType>>([]);

/**
 * return boolean of whether the message is mine or not
 * @param {object} item
 */
const checkIfMessageIsMine = (item) => {
  if (
    item.user.name ===
    $globalProps.$myClient.userList[$globalProps.$myClient.userIndex].name
  ) {
    return true;
  }
};

/**
 * update room info
 * @param {object} room
 */
messageList.value = $apiClient.getRoomInfo();
</script>

<style scoped lang='scss'>
.chatMessage {
  $root: &;

  &:not(:last-of-type) {
    margin-bottom: 32px;
  }

  &.is-mine {
    text-align: right;

    #{$root}__user {
      justify-content: end;
    }

    #{$root}__item {
      padding: 0 0 0 32px;
    }

    #{$root}__time {
      right: inherit;
      left: 0;
    }
  }

  &__item {
    display: inline-block;
    width: min(100%, 320px);
    position: relative;
    padding: 0 32px 0 0;
  }

  &__user {
    display: flex;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  &__userName {
    @include fs(14);
    color: $color-05;
    margin-right: 8px;
  }

  &__userImg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: 0 0 4px $color-05;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }

  &__comment {
    padding: 16px;
    background-color: $color-01;
    border-radius: 1em;
    box-shadow: 2px 2px 4px #939393;
  }

  &__commentText {
    text-align: left;
    color: #fff;
  }

  &__time {
    position: absolute;
    bottom: 0;
    right: 0;
    color: $color-05;
    @include fs(10);
    letter-spacing: 0.04em;
  }
}
</style>
