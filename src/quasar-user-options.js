import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'



import {
  Dialog,
  Notify,
  LocalStorage, 
  SessionStorage,
  Loading,
  QSpinnerGears,
  Cookies
} from 'quasar'
// To be used on app.use(Quasar, { ... })
export default {
  config: {},
  plugins: {
    Loading,
    Notify,
    Dialog,
    LocalStorage, 
    SessionStorage,
    QSpinnerGears,
    Cookies
  }
}