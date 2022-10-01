<template>
  <div class="roomBox">
    <p class="roomBox__text">Create Room</p>
    <div class="roomBox__wrap">
      <textarea name="roomBoxTextarea" id="roomBoxTextarea" class="roomBox__textarea" placeholder="Enter Room Name" rows="1" maxlength="20"
        @change="checkTexts" @keyup="checkTexts" ref="textarea"></textarea>
      <button class="roomBox__btn" ref="btn" @click="pushNewRoom">
        <img src="/assets/img/icon-create.svg" alt="add room">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, Ref } from "vue";

// Inject
 const $globalProps:any = inject('$globalProps');
const $apiClient: any = inject("$apiClient");

// Ref
const btn: Ref<HTMLButtonElement> = ref(null);
const textarea: Ref<HTMLTextAreaElement> = ref(null);


/**
 * check text length
 * @returns {void}
 */
const checkTexts = (e) => {
  const condition = e.currentTarget.value.length > 0;
  if (condition) {
    btn.value.classList.add('is-active');
  } else {
    btn.value.classList.remove('is-active');
  }
}

/**
 * update_selectOptions
 * @returns {void}
 */
const pushNewRoom = () => {
  // error if same name of room exsits
  if($globalProps.$myClient.room.find((room)=>textarea.value.value === room)) {
    alert('a room of this name has been already exsists');
    textarea.value.value = '';
    return;
  }
  $globalProps.$myClient.room.push(textarea.value.value);
  $apiClient.putMyClient($globalProps.$myClient);
  textarea.value.value = '';
}

</script>

<style scoped lang="scss">
.roomBox {
  margin-bottom: 24px;
  padding: 0 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &__text {
    color: $color-06;
    margin-bottom: 4px;
  }

  &__wrap {
    width: 100%;
    display: flex;
    align-items: center;
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
