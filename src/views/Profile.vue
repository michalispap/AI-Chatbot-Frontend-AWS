<template>
  <div class="profile-container">
    <h1 class="title">User Profile</h1>
    <form @submit.prevent="saveProfile">
      <label>First Name</label>
      <input v-model="user.firstName" type="text" />

      <label>Last Name</label>
      <input v-model="user.lastName" type="text" />

      <label>Email</label>
      <input v-model="user.email" type="email" />

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUser();
});

const saveProfile = () => {
  userStore.updateUser({
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
  });
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 50px auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #409cff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

@media (max-width: 600px),
       (orientation: landscape) and (max-height: 600px) {
  .profile-container {
    max-width: none;
    width: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
