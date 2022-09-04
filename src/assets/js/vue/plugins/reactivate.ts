import { reactive } from 'vue';

export default (app, value) => {
    const $myClient = reactive(value);

    app.config.globalProperties.$obj = () => {
        return $myClient
    };
}