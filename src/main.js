import { createApp } from 'vue'
import App from './App.vue'
import pages from '@/pages'



const app = createApp(App);

pages.forEach(page => {
    app.component(page.name, page)
});

// components.forEach(comp=> {
//     app.component(comp.name, comp)
// })

app.mount('#app');
