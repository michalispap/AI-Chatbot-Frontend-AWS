import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'eu-central-1',
      userPoolId: 'eu-central-1_ujDEumbz7',
      userPoolWebClientId: '6d2oc9v4mao92bsupqfto99cnl',
      
      oauth: {
        domain: 'eu-central-1-ujdeumbz7.auth.eu-central-1.amazoncognito.com',
        scope: ['email', 'profile', 'openid', 'phone'],
        redirectSignIn: 'https://master.d3nlp5uork9q7a.amplifyapp.com/',
        redirectSignOut: 'https://master.d3nlp5uork9q7a.amplifyapp.com/',
        responseType: 'code'
      }
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');