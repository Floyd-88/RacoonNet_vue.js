import { createApp } from 'vue'
import App from './App.vue'
import pages from '@/pages'
import components from "@/components"
import router from "@/router/router"
import axios from "axios"
import store from "@/store/store";

const app = createApp(App);

app.$http = axios;
const token = localStorage.getItem('token');
if(token) {
    app.$http.defaults.headers.common['Authorization'] = token;
}

pages.forEach(page => {
    app.component(page.name, page);
});

components.forEach(comp=> {
    app.component(comp.name, comp);
});

app.use(router);
app.use(store)
app.mount('#app');

