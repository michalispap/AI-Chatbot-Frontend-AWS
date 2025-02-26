import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'us-east-1', // replace with your region
      userPoolId: 'us-east-1_abc123', // replace with your pool ID
      userPoolWebClientId: '1234567890abcdef', // replace with your client ID
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');