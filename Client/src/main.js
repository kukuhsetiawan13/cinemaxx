import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { markRaw } from 'vue'

import router from './routes'
import "./assets/main.css";

import Paginate from "vuejs-paginate-next";


const app = createApp(App);
const pinia = createPinia()


pinia.use(({ store }) => {
    store.router = markRaw(router)
})

app.use(Paginate)
app.use(pinia)
app.use(router)


app.mount("#app");




