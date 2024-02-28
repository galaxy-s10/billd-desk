import '@/assets/css/main.scss';
import { createApp } from 'vue';

import Message from '@/components/Message/index.vue';
import { i18n } from '@/hooks/use-i18n';
import router from '@/router/index';
import store from '@/store/index';

import App from './App.vue';

const messageEl = document.createElement('div');
document.body.appendChild(messageEl);

const app = createApp(App);
const message = createApp(Message);

app.use(store);
app.use(router);
app.use(i18n);

app.mount('#app');
message.mount(messageEl);
