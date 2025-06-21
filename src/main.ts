import { createApp } from 'vue'
import { createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';
import './assets/styles/style.css'
import App from './App.vue'
import router from './router/index.ts';
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);

router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();
    const { isRegistered, isIssuer } = storeToRefs(userStore);
    if(to.path.toLowerCase() === '/register' && isRegistered.value){
        next('/')
    }
    else if(isIssuer.value && isRegistered.value && to.path.toLowerCase() === '/dashboard'){
        next('/issuer')
    }
    else if(!isIssuer.value &&  isRegistered.value && to.path.toLowerCase() === '/issuer'){
        next('/dashboard')
    }
    else if((to.path.toLowerCase() === '/issuer' || to.path.toLowerCase() === '/dashboard') && !isRegistered.value){
        next('/register')
    }
    else {
        if(!isRegistered.value && to.path.toLowerCase() !== '/register'){
            userStore.clearUser();
        }
        next()
    }
})
app.use(router);
app.use(pinia);
app.mount('#app');
