import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_DYaYaoaK4',
      userPoolClientId: '4d7lkoonmut5jvc0i42np9ds1f',
      loginWith: {
        oauth: {
          domain: 'eu-central-1dyayaoak4.auth.eu-central-1.amazoncognito.com',
          scopes: ['email', 'profile', 'openid'],
          responseType: 'code',
          redirectSignIn: ['https://master.d3nlp5uork9q7a.amplifyapp.com/'],
          redirectSignOut: ['https://master.d3nlp5uork9q7a.amplifyapp.com/']
        }
      }
    }
  }
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');