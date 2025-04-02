import { createApp } from 'vue';
import './style.css';
import { VueScanPlugin } from '@razz21/vue-scan';
import App from './App.vue';

const app = createApp(App);

const plugin = VueScanPlugin();

app.use(plugin);

app.mount('#app');
