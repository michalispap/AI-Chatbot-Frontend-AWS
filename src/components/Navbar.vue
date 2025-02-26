<template>
  <nav>
    <div class="brand">
      <router-link to="/" class="brand-link">
        <h1>Better Canvas</h1>
      </router-link>
    </div>
    <div class="links" v-if="!isLoginPage">
      <router-link to="/profile">Profile</router-link>
      <router-link to="/chat">Chat</router-link>
      <button class="logout-btn" @click="handleLogout">Log out</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoginPage = computed(() => {
  return route.path === "/login";
});

const handleLogout = async () => {
  await authStore.signOut();
  router.push("/login");
};
</script>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #409cff;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-link {
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.nav-logo {
  width: 40px;
  height: 40px;
}

.links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.links a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

.logout-btn {
  background-color: #1d63ae;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    text-align: center;
  }
  .links {
    margin-top: 10px;
  }
}
</style>