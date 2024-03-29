import { createApp } from 'vue'
import App from './App.vue'
import pages from '@/pages'
import components from "@/components"
import router from "@/router/router"
import store from "@/store/index"

const app = createApp(App);

// const token = localStorage.getItem('token');
// if (token) {
//     axios.defaults.headers.common['Authorization'] = token;
// }

pages.forEach(page => {
    app.component(page.name, page);
});

components.forEach(comp => {
    app.component(comp.name, comp);
});

app.use(router);
app.use(store);
app.mount('#app');

window.fallbackImage = require('./assets/ava/ava_1.jpg')