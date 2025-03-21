import { createApp } from 'vue';
import './style.css';
import { VueScanPlugin } from 'vue-scan';
import App from './App.vue';

const app = createApp(App);
app.use(VueScanPlugin, {
  logToConsole: true,
});

app.mount('#app');
