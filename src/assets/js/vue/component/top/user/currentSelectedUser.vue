<template>
  <div class="user" v-if="selectedUser">
    <div class="user__icon">
      <input type="file" id="iconChange" name="upName" class="user__iconChangeInput" accept="image/*" ref="input">
      <label for="iconChange" class="user__iconChangeLabel">
        <img src="/assets/img/icon-photo.svg" alt="change this user icon" width="20" height="20">
      </label>
      <div class="user__iconWrap">
        <img :src="selectedUser.path" alt="">
      </div>
    </div>
    <p class="user__name">{{ selectedUser.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, onMounted, nextTick, watch } from 'vue';

// Inject
const socket: any = inject('$socket');
const globalProps: any = inject('$globalProps');

// Ref
const input: Ref<HTMLInputElement> = ref(null);

const selectedUser = computed(() => globalProps.$myClient.userList[globalProps.$myClient.userIndex]);

/**
* change user icon
* @returns {void}
*/
const changeUserIcon = () => {
  const submitUserIcon = (e) => {
    const file = e.currentTarget.files[0];

    let file_reader = new FileReader();
    file_reader.readAsDataURL(file);

    // after complete file reading
    file_reader.addEventListener('load', (e) => {

      const formData = new FormData();
      formData.append('userIcon', file);
      const request = new Request('/upload', {
        method: 'POST',
        body: formData,
        credentials: 'omit'
      });

      fetch(request)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Something wrong with HTTP communication');
            } else if (response.status === 500) {
              throw new Error("Folder to put images doesn't exsist");
            }
          }
          return response.text();
        })
        // ↓if JSON send↓
        // .then(response => response.json())
        .then(data => {
          globalProps.$myClient.userList[globalProps.$myClient.userIndex].path = data;
          socket.emit('ioUpdateMyClientOfServer', globalProps.$myClient);
          socket.emit('ioReflectNewIconForMessages', globalProps.$myClient.userList[globalProps.$myClient.userIndex].name, globalProps.$myClient.userList[globalProps.$myClient.userIndex].path);
        })
        .catch((error) => {
          alert(error);
        });

    });
  }
  input.value.addEventListener('change', submitUserIcon);
}

onMounted(() => {
  if (input.value) {
    changeUserIcon();
  }
});

/**
 * watch - when selectedUser changes
 * @returns {void}
 */
if (!selectedUser.value) {
  const unwatch = watch(selectedUser, () => {
    /**
    * nextTick
    * @returns {void}
  */
    nextTick(() => {
      changeUserIcon();
      unwatch();
    })
  })
}

</script>

<style scoped lang="scss">
.user {
  $root: &;

  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  border: none;

  &__icon {
    position: relative;
  }

  &__iconWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0px 0px 8px #fff;
    margin-right: 0;
    margin-bottom: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }

  &__name {
    @include fs(18);
    color: #fff;
    text-shadow: 0 0 8px $color-06;
  }

  &__icon,
  &__name {
    transition: 0.3s;
  }

  &__iconChangeInput {
    display: none;
  }

  &__iconChangeLabel {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -16px;
    right: -16px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }
}
</style>
