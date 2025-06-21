<script setup lang="ts">
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { useUserStore } from './stores/user'
import { useWalletStore } from './stores/wallet'; 
import { useRouter } from 'vue-router';
import ToastContainer from './components/ToastContainer.vue';
const userStore = useUserStore();
const walletStore = useWalletStore();
onMounted(async () => {
  const router = useRouter();
  const connected = await walletStore.checkConnection();
  if(userStore.address !== null && !connected){
    userStore.clearUser();
    router.push('/');
  } else if(userStore.address === null && connected){
    walletStore.disconnect();
    router.push('/');
  }
})


</script>

<template>
  <div class="min-h-screen flex flex-col">
    <router-view class="flex-grow"/>
    <Footer/>
  </div>
  <ToastContainer/>
</template>

<style>

</style>
