<template>
  <button class="help-btn" @click="toggleHelp"><span>?</span></button>
  <div class="help">
    <dl class="help__list">
      <dt class="help__ttl">The Maximum Account</dt>
      <dd class="help__data">You can register 3 account in maximum.</dd>
      <dt class="help__ttl">Account Icon Change</dt>
      <dd class="help__data">You can change your account icon by clicking a small button positioned in top-right of the
        selected and selecting a picture.</dd>
      <dt class="help__ttl">Account Deletion</dt>
      <dd class="help__data">You can delete your account by clicking a garbage button shown when hovering the account in
        list.</dd>
      <dt class="help__ttl">Entry to Chat Room</dt>
      <dd class="help__data">You can enter when both of your account and a room are selected.</dd>
    </dl>
  </div>

  <div class="mv" :style="{ 'background-image': 'url(' + backgroundImage + ')' }">
    <CurrentSelectedUser></CurrentSelectedUser>
  </div>

  <div class="detail">
    <ul class="detail__userList">
      <UserList></UserList>
    </ul>
    <CreateNewUser></CreateNewUser>
    <div class="detail__room">
      <CreateNewRoom></CreateNewRoom>
      <SelectRoom></SelectRoom>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import CurrentSelectedUser from "./user/currentSelectedUser.vue";
import UserList from "./user/userList.vue";
import CreateNewUser from "./user/createNewUser.vue";
import CreateNewRoom from "./room/createNewRoom.vue";
import SelectRoom from "./room/selectRoom.vue";

const backgroundImage: string = "/assets/img/bg-mountain.svg";

const toggleHelp = (e) => {
  e.currentTarget.classList.toggle("is-open");
};
</script>

<style scoped lang="scss">
.help-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  transition: box-shadow 0.3s ease-in-out,
    background-color 0.3s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    box-shadow: 0 0 10px 0 #fff;
  }

  span {
    font-size: 1.2rem;
    color: $color-03;
    transition: color 0.3s ease-in-out;
  }

  &.is-open {
    background-color: $color-03;
    box-shadow: 0 0 10px 0 $color-03;
    transition-delay: .3s;

    span {
      color: #fff;
      transition-delay: .3s;
    }
  }
}

.help {
  $root: &;
  width: 100%;
  height: 100%;
  padding: 32px 64px 24px 32px;
  background-color: #fff;
  border-bottom-left-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.9);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
  z-index: 10;

  .help-btn.is-open+& {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: inherit;

    #{$root}__list {
      opacity: 1;
      visibility: visible;
      transition-delay: .3s;
    }
  }

  &__list {
    padding-left: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  }

  &__ttl {
    display: list-item;
    list-style-type: desc;
    font-size: 1.1rem;
    color: $color-02;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__data {
    margin-bottom: 24px;
  }

  >*:last-child {
    margin-bottom: 0;
  }
}

.mv {
  position: relative;
  height: 350px;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: $color-01;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail {
  background-color: $color-04;
  padding: 48px 64px 64px;
}
</style>
