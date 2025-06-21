<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWalletStore } from '../stores/wallet';
import { storeToRefs } from 'pinia';
const walletStore = useWalletStore();
const { connect, disconnect, checkConnection } = walletStore;
const {  currentAccount, isLoading} = storeToRefs(walletStore);
const walletConnected = ref(false);
const handleConnectWallet = async () => {
  await connect();
  console.log(currentAccount.value)
  walletConnected.value = currentAccount.value !== '';
};

const handleDisconnectWallet = async () => {
  await disconnect();
  walletConnected.value = false;
}


onMounted(async () => {
  if (await checkConnection()) {
    walletConnected.value = true
  }
})
</script>

<template>
  <div class="test min-h-screen ">
    <button @click="handleConnectWallet" :disabled="isLoading">
      {{ walletConnected ? 'Wallet Connected' : 'Connect Wallet' }}
    </button>
    <button class="ml-3 !bg-red-200" @click="handleDisconnectWallet" :disabled="isLoading">
      Disconnect Wallet
    </button>

    <p>Wallet Address: {{ currentAccount }}</p>


  </div>
</template>

<style scoped>
.test {
  padding: 10px;
  background-color: rgb(204, 145, 145);
}

button {
  padding: 10px;
  border-radius: 5px;
  background-color: orange;
  border: 1px solid black;
}
</style>
