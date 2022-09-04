<template>
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
import CurrentSelectedUser from './user/currentSelectedUser.vue'
import UserList from './user/userList.vue'
import CreateNewUser from './user/createNewUser.vue'
import CreateNewRoom from './room/createNewRoom.vue'
import SelectRoom from './room/selectRoom.vue'

const backgroundImage: string = '/assets/img/bg-mountain.svg';

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
  align-items: center;
}

.detail {
  background-color: $color-04;
  padding: 48px 64px 64px;
}
</style>
