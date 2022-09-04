import { reactive } from 'vue';

let globalProps = reactive({
  $myClient: null,
  $currentRoom: null,
});

export default globalProps;