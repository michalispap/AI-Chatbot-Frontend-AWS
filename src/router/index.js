import { createRouter, createWebHistory } from "vue-router";
import Profile from "../views/Profile.vue";
import Chat from "../views/Chat.vue";
import Login from "../views/Login.vue";
import { fetchAuthSession } from 'aws-amplify/auth';

const routes = [
  { path: "/", redirect: "/chat" },
  { 
    path: "/profile", 
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: "/chat", 
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const session = await fetchAuthSession();
      if (session.tokens) {
        next(); // User is authenticated, proceed
      } else {
        next({ path: "/login" });
      }
    } catch (error) {
      // User is not authenticated, redirect to login
      next({ path: "/login" });
    }
  } else {
    next(); // Route doesn't require auth, proceed
  }
});

export default router;