import { createRouter, createWebHistory } from "vue-router";
import Profile from "../views/Profile.vue";
import Chat from "../views/Chat.vue";
import Login from "../views/Login.vue";
import { fetchAuthSession } from 'aws-amplify/auth';

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: "/",
    redirect: "/chat"
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;
  try {
    const session = await fetchAuthSession();
    if (!session.tokens) {
      return '/login';
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return '/login';
  }
  return true;
});

export default router;