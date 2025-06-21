<script setup>
import { ShieldCheckIcon, QrCodeIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router';
import router from '../router';
import Header from '../components/Header.vue';
import Hero from '../components/home/HeroSection.vue';
import FeatureSection from '../components/home/FeatureSection.vue';
import HowItWorksSection from '../components/home/HiWSection.vue';
import UseCasesSection from '../components/home/UseCasesSection.vue';

</script>
<template>
  <main>
    <Header />
    <Hero />
    <FeatureSection />
    <HowItWorksSection />
    <UseCasesSection />
  </main>
</template>

<style scoped>
main {
  background: #271712;
  background: linear-gradient(90deg, rgb(14, 10, 7) 0%, rgb(54, 27, 27) 100%);
}
</style>