<template>
  <div class="roomBox">
    <p class="roomBox__text">Select Room</p>
    <div class="roomBox__wrap">
      <select name="roomBoxSelect" id="roomBoxSelect" class="roomBox__select" ref="select" required
        @change="switchActive">
        <option value="">Select Room Name</option>
        <option :value="room" v-for="(room, index) in globalProps.$myClient.room" :key="room" :selected="checkSelected(index)">{{ room }}</option>
      </select>
      <router-link to="/chat" class="roomBox__btn" @click="confirmRoomIndex(); addToRoomInfo(); prepareForNextPage(); requestAllData();">
        <img src="/assets/img/icon-select.svg" alt="enter to chat room">
      </router-link>
    </div>
    <p class="roombox__note"></p>
  </div>
</template>

<script setup lang="ts">
import { inject, watch, nextTick, ref, Ref } from "vue";

// Inject
const socket: any = inject("$socket");
const globalProps: any = inject('$globalProps');

// Ref
const select: Ref<HTMLSelectElement> = ref(null);

/**
 * if default option selected, inactivate btn
 * if added option selected, activate btn
 * @returns {void}
 */
const returnIsRoomChecked = () => {
  const condition: boolean = select.value.selectedIndex !== 0;

  return condition;
};

/**
 * check one of userList has 'is-current'
 * @returns {void}
 */
const checkIsUserSelected = () => {
  if (typeof globalProps.$myClient.userIndex === "number") {
    return true;
  }
};

/**
 * switch active class of btn
 * @returns {void}
 */
const switchActive = () => {
  if (returnIsRoomChecked() && checkIsUserSelected()) {
    select.value.nextElementSibling.classList.add('is-active');
  } else {
    select.value.nextElementSibling.classList.remove('is-active');
  }
}

/**
 * send user info to chat page
 * @returns {void}
 */
const confirmRoomIndex = () => {
  globalProps.$myClient.roomIndex = select.value.selectedIndex - 1;
  socket.emit('ioUpdateMyClientOfServer', globalProps.$myClient);
}

/**
 * add room to roomInfo
 * @returns {void}
 */
const addToRoomInfo = () => {
  socket.emit('ioUpdateRoomInfoOfServer', globalProps.$myClient.room[globalProps.$myClient.roomIndex]);
}

/**
 * refer to roomInfo
 * @returns {void}
 */
const prepareForNextPage = () => {
  socket.emit('ioRequestRoomInfo', globalProps.$myClient.room[globalProps.$myClient.roomIndex]);
}

/**
 * refer to roomInfo
 * @returns {void}
 */
const requestAllData = () => {
  socket.emit('ioRequestAllDataOfServer');
}

const checkSelected = (index)=>{
  if(globalProps.$myClient.room.length + 1 === index + 2) {
    return true;
  }
};

/**
 * create
 * @returns {void}
 */
nextTick(() => {
  if(typeof globalProps.$myClient.roomIndex === 'number') {
    const options = select.value.options;
    options[globalProps.$myClient.roomIndex + 1].selected = true;
  }
  switchActive();
  })

/**
 * watch - when (globalProps.$myClient.userIndex || globalProps.$myClient.room) changes
 * @returns {void}
 */
watch(globalProps, () => {
  /**
   * nextTick
   * @returns {void}
 */
nextTick(() => {
    switchActive();
  })

}, { deep: true });

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

  &__select {
    width: calc(100% - 24px);
    border: 1px solid $color-05;
    border-radius: 4px;
    color: $color-06;

    option {
      padding: 20px 0;
      @include fs(10);
    }
  }

  &__btn {
    background-color: transparent;
    border: none;
    outline: none;
    margin-left: 8px;
    opacity: .3;
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
