<template>
  <li class="user" v-for="(user, index) in returnUserList" :key="user.name" @click="changeUserIndex(index)"
    :class="{ 'is-current': index === globalProps.$myClient.userIndex }">
    <button class="user__btn">
      <div class="user__icon">
        <img :src="user.path" alt="">
      </div>
      <p class="user__name">{{ user.name }}</p>
    </button>
    <div class="user__deleteWrap" @click="removeUserFromUserList($event, index)">
      <button class="user__deleteBtn"><img src="/assets/img/icon-delete.svg" alt="このアカウントを削除する"></button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";

// Inject
const socket: any = inject('$socket');
const globalProps: any = inject('$globalProps');

/**
 * return_userList
 * @returns {Array}
 */
const returnUserList = computed(() => {
  return globalProps.$myClient.userList;
});

/**
 * remove_userAccount
 * @returns {void}
 */
const removeUserFromUserList = (e, index) => {
   e.stopPropagation();
  const parent = e.currentTarget.parentNode;
  if(parent.classList.contains('is-current')) {
    globalProps.$myClient.userIndex = null;
  }
  parent.remove();
  globalProps.$myClient.userList.splice(index, 1);
  socket.emit('ioUpdateMyClientOfServer', globalProps.$myClient);
}

/**
 * manipulate_is-current
 * @returns {void}
 */
const changeUserIndex = (index) => {
  globalProps.$myClient.userIndex = index;
  socket.emit('ioUpdateMyClientOfServer', globalProps.$myClient);
}

</script>

<style scoped lang="scss">
.user {
  $root: &;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 16px;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }

  &__btn {
    width: calc(100% - 48px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;


    &:hover,
    &:focus,
    &:active {
      #{$root}__icon {
        transform: scale(1.2);
      }

      #{$root}__name {
        @include fs(20);
      }
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    margin-right: 24px;
    background-color: $color-05;
    border-radius: 50%;
    box-shadow: 0px 0px 4px $color-05;
    transform-origin: center center;

    img {
      display: none;
    }
  }

  &__name {
    color: $color-06;
  }

  &__icon,
  &__name {
    transition: 0.3s;
  }

  &__deleteWrap {
    overflow: hidden;
  }

  &__deleteBtn {
    @include fs(14);
    background-color: $color-03;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity .3s ease-in-out, visibility .3s ease-in-out;

    img {
      width: auto;
      transform-origin: center center;
      transition: transform .2s ease-in-out;
    }

    &:hover,
    &:focus,
    &:active {
      opacity: 1;

      img {
        transform: scale(1.1);
      }
    }
  }

  &:hover {
    #{$root}__deleteBtn {
      opacity: 1;

      img {
        will-change: transform;
      }
    }
  }

  &.is-current {
    #{$root}__icon {
      transform: scale(1.2);
    }

    #{$root}__name {
      @include fs(20);
    }
  }
}
</style>
