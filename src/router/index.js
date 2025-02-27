import { createRouter, createWebHistory } from "vue-router";
import Profile from "../views/Profile.vue";
import Chat from "../views/Chat.vue";
import Login from "../views/Login.vue";
import AuthCallback from "../views/AuthCallback.vue";
import { fetchAuthSession } from 'aws-amplify/auth';

const routes = [
  // Auth callback route must be first and not require authentication
  { 
    path: "/callback", 
    component: AuthCallback,
    meta: { requiresAuth: false }
  },
  { 
    path: "/", 
    redirect: "/chat" 
  },
  { 
    path: "/login", 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: "/profile", 
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: "/chat", 
    component: Chat,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Allow callback and login routes without authentication
  if (to.meta.requiresAuth === false) {
    next();
    return;
  }

  try {
    const session = await fetchAuthSession();
    if (session.tokens) {
      next(); // User is authenticated, proceed
    } else {
      next('/login');
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    next('/login');
  }
});

export default router;