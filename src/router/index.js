import { createRouter, createWebHistory } from "vue-router";
import Profile from "../views/Profile.vue";
import Chat from "../views/Chat.vue";

const routes = [
  { path: "/", redirect: "/chat" },
  { path: "/profile", component: Profile },
  { path: "/chat", component: Chat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
