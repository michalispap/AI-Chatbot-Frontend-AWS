<template>
  <div id="app">
    <Navbar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    router.push('/chat');
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  background-color: #d6e6ff;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #d6e6ff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
