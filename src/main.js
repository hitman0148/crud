import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar, Notify, Dialog, Cookies } from 'quasar'
import quasarUserOptions from './quasar-user-options'

createApp(App).use(
    Quasar, 
    quasarUserOptions, 
    Notify, 
    Dialog,
    Cookies
).use(router).mount('#app')
