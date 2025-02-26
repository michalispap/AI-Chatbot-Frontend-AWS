import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'us-east-1', //replace with actual region
      userPoolId: 'us-east-1_abc123', //replace with actual pool ID
      userPoolWebClientId: '1234567890abcdef', // replace with actual client ID
      
      oauth: {
        domain: 'your-domain.auth.us-east-1.amazoncognito.com', //replace with actual Cognito domain
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: '/', //replace with actual app URL
        redirectSignOut: '/', //replace with actual app URL
        responseType: 'code'
      }
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');