<template>
  <div class="user">
    <button class="user__btn" v-if="!clicked && checkUserAccountLength" @click="clicked = true">
      <div class="user__icon">
        <img src="/assets/img/img-user-01.jpg" alt="">
      </div>
      <p class="user__name">New Account</p>
    </button>
    <div class="enterBox" v-if="clicked && checkUserAccountLength">
      <textarea name="enterBoxTextarea" id="enterBoxTextarea" class="enterBox__textarea" placeholder="Enter User Name"
        rows="1" maxlength="20" @change="checkTexts" @keyup="checkTexts" ref="textarea"></textarea>
      <button class="enterBox__btn" ref="btn" @click="clicked = false; addUserToUserList()">
        <img src="/assets/img/icon-create.svg" alt="add a room">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue Options
import { computed, ref, Ref, inject } from "vue";
const $apiClient: any = inject("$apiClient");

// Ref
const btn: Ref<HTMLElement> = ref(null);
const textarea: Ref<HTMLTextAreaElement> = ref(null);
const clicked: Ref<boolean> = ref(false);

// Inject
const $globalProps: any = inject('$globalProps');

/**
 * check user account length
 * @returns {boolean}
 */
const checkUserAccountLength = computed(() => {
  if ($globalProps.$myClient.userList.length < 3 || undefined) {
    return true;
  } else {
    return false;
  }
});

/**
 * check text length
 * @returns {void}
 */
const checkTexts = (e: any): void => {
  const condition: boolean = e.currentTarget.value.length > 0;
  if (condition) {
    btn.value.classList.add('is-active');
  } else {
    btn.value.classList.remove('is-active');
  }
}

/**
 * add user to userList
 * @returns {void}
 */
const addUserToUserList = (): void => {
    // error if same name of room exsits
  if($globalProps.$myClient.userList.find((user)=> textarea.value.value === user.name)) {
    alert('a user of this name has been already exsists');
    return;
  }
  const user = {
    name: textarea.value.value,
    path: "/assets/img/img-user-01.jpg"
  }
  $globalProps.$myClient.userList.push(user);
  $apiClient.putMyClient($globalProps.$myClient);
}

</script>

<style scoped lang="scss">
.user {
  $root: &;

  margin-bottom: 32px;
  padding: 0 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &__btn {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &+& {
      margin-top: 20px;
    }


    @include hover {
      #{$root}__icon {
        @include fs(17);
        transform: scale(1.2);
      }

      #{$root}__name {
        @include fs(17);
      }
    }
  }

  &__icon {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: 0px 0px 4px $color-05;
    margin-right: 24px;
    background-color: #fff;

    &::before {
      position: absolute;
      content: '+';
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      @include fs(24);
      color: $color-05;
    }

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
}

.enterBox {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;

  .user+& {
    margin-top: 20px;
  }

  &__textarea {
    width: calc(100% - 24px);
    border: 1px solid $color-05;
    border-radius: 4px;
    color: $color-06;
  }

  &__btn {
    background-color: transparent;
    border: none;
    outline: none;
    margin-left: 8px;
    opacity: .3;
    pointer-events: none;
    transition: transform .5s;

    &.is-active {
      opacity: 1;
      pointer-events: inherit;
      cursor: pointer;

      &:hover,
      &:focus,
      &:active {
        transform: scale(1.3);
      }
    }
  }
}
</style>
