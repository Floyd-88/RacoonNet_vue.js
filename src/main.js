import { createApp } from 'vue'
import App from './App.vue'
import pages from '@/pages'
import router from "@/router/router";



const app = createApp(App);

pages.forEach(page => {
    app.component(page.name, page)
});

// components.forEach(comp=> {
//     app.component(comp.name, comp)
// })

app.use(router)
app.mount('#app');

