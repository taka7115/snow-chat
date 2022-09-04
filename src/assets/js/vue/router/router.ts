// router.ts
import { createRouter,createWebHistory } from 'vue-router';
import Top from "../component/top/top.vue";
import Chat from "../component/chat/chat.vue";

/**
 * switch top and chat page
 */
const routes = [
    { path: '/', name: 'top', component: Top, props: true },
    { path: '/chat', name: 'chat', component: Chat, props: true }
]

const router = createRouter({
    history: createWebHistory(), // HTML5 History モード
    routes,
})

export default router;