<template>
  <div class="chatHeader">
    <div class="chatHeader__inner">
      <router-link to="/" class="chatHeader__back">
        <img :src="'/assets/img/icon-back.svg'" alt="前のページに戻る">
      </router-link>
      <h1 class="chatHeader__roomName">{{roomName}}</h1>
      <button class="chatHeader__photo">
        <img :src="'/assets/img/icon-photo.svg'" alt="このチャットルームでアップロードされた写真一覧を見る">
      </button>
      <button class="chatHeader__search">
        <img :src="'/assets/img/icon-search.svg'" alt="このチャットルームのコメントからテキストを検索する">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

// Inject
const globalProps: any = inject('$globalProps');

// room name
const roomName = globalProps.$myClient.room[globalProps.$myClient.roomIndex];


</script>

<style scoped lang="scss">
.chatHeader {
  width: 100%;
  background-color: $color-01;

  &__inner {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    min-height: 56px;
  }

  &__back {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 24px 0 32px;
  }

  &__roomName {
    color: #fff;
  }

  &__photo {
    height: 100%;
    padding: 0 12px;
  }

  &__search {
    height: 100%;
    padding: 0 32px 0 12px;
  }

  &__back,
  &__photo,
  &__search {
    transition: opacity .3s ease-in-out;

    @include hover {
      opacity: .7;
    }
  }
}
</style>
