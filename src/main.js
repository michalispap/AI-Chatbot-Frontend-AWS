import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_ujDEumbz7',
      userPoolClientId: '6d2oc9v4mao92bsupqfto99cnl',
      loginWith: {
        oauth: {
          domain: 'eu-central-1ujdeumbz7.auth.eu-central-1.amazoncognito.com',
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: ['https://master.d3nlp5uork9q7a.amplifyapp.com/callback'],
          redirectSignOut: ['https://master.d3nlp5uork9q7a.amplifyapp.com'],
          responseType: 'code'
        }
      }
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');