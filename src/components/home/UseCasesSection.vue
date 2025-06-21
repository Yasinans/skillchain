<template>
  <section class="relative isolate overflow-hidden border-[#4f4b61] " id="use-cases">
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true">
      <defs>
        <pattern id="use-cases-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" stroke-width="0" fill="url(#use-cases-pattern)" />
    </svg>


    <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:py-40">
      <div class="text-center mb-16">
        <h2 class="the-h2 text-4xl font-bold tracking-tight sm:text-6xl">
          Real World Applications
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
          Discover how blockchain credentials are transforming industries and streamlining processes
        </p>
      </div>

      
      <div class="flex flex-wrap justify-center mb-16 gap-4">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
          'px-6 py-3 rounded-md font-semibold transition-all duration-300',
          activeTab === tab.id
            ? 'bg-[#e6902e] hover:bg-[#e67f0af1] text-white shadow-sm'
            : 'text-gray-300 hover:text-white border border-white/10 hover:border-[#e6902e]/30'
        ]">
          <component :is="tab.icon" class="w-5 h-5 inline-block mr-2" />
          {{ tab.title }}
        </button>
      </div>

      
      <Transition name="fade" mode="out-in">
        <div :key="activeTab" class="max-w-7xl mx-auto">
          <div class="lg:flex lg:gap-x-10 lg:items-center">
            
            <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-0 lg:mr-10 lg:mt-0 lg:max-w-none lg:flex-none">
              <div class="max-w-2xl flex-none">
                <div class="relative">
                  <div class="w-full max-w-2xl rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 p-8 text-center">
                    <component :is="currentTab.visual.icon" class="w-24 h-24 mx-auto text-[#e6902e] mb-6" />
                    <h4 class="text-xl font-semibold text-white mb-4">{{ currentTab.visual.title }}</h4>
                    <p class="text-gray-300">{{ currentTab.visual.description }}</p>

                    
                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div v-for="stat in currentTab.stats" :key="stat.label" class="text-center">
                        <div class="text-xl font-bold text-[#e6902e]">{{ stat.value }}</div>
                        <div class="text-xs text-gray-400 mt-1">{{ stat.label }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl order-first lg:order-last">
              <div class="space-y-8">
                <div>
                  <h3 class="the-h3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {{ currentTab.title }}
                  </h3>
                  <p class="mt-6 text-lg leading-8 text-gray-300">
                    {{ currentTab.description }}
                  </p>
                </div>

                
                <div class="space-y-4">
                  <div v-for="(benefit, index) in currentTab.benefits" :key="index" class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#e6902e] flex items-center justify-center mt-1">
                      <CheckIcon class="w-4 h-4 text-white" />
                    </div>
                    <div class="flex-1">
                      <p class="text-white font-medium">{{ benefit.title }}</p>
                      <p class="text-gray-400 text-sm mt-1">{{ benefit.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-10 flex items-center gap-x-6">

                    <a :href="currentTab.cta.link"
                      class="rounded-md transition-all bg-[#e6902e] hover:bg-[#e67f0af1] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#e67f0af1]">
                      {{ currentTab.cta.text }}
                    </a>
                  <p class="text-sm font-semibold leading-6 text-gray-300">
                    {{ currentTab.cta.subtitle }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CheckIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

interface Benefit {
  title: string
  description: string
}

interface Stat {
  value: string
  label: string
}

interface TabContent {
  id: string
  title: string
  description: string
  icon: any
  visual: {
    icon: any
    title: string
    description: string
  }
  benefits: Benefit[]
  stats: Stat[]
  cta: {
    text: string
    subtitle: string
    link: string
  }
}

const activeTab = ref('hiring')

const tabs: TabContent[] = [
  {
    id: 'hiring',
    title: 'Revolutionize Your Hiring Process',
    description: 'Transform recruitment with instant, fraud-proof credential verification that saves time and money while ensuring candidate authenticity.',
    icon: UserGroupIcon,
    visual: {
      icon: DocumentCheckIcon,
      title: 'Instant Verification',
      description: 'Verify credentials in seconds, not weeks'
    },
    benefits: [
      {
        title: 'Reduce verification costs from $5,000 to $0',
        description: 'Eliminate expensive third-party verification services'
      },
      {
        title: 'Cut background check time from weeks to seconds',
        description: 'Real-time verification through blockchain technology'
      },
      {
        title: 'Eliminate resume fraud with blockchain-proof credentials',
        description: 'Immutable records ensure complete authenticity'
      },
      {
        title: 'Streamline onboarding process',
        description: 'Pre-verified candidates start work immediately'
      }
    ],
    stats: [
      { value: '$0', label: 'Verification Cost' },
      { value: '2 sec', label: 'Check Time' },
      { value: '100%', label: 'Fraud Prevention' }
    ],
    cta: {
      text: 'Try Verification Now',
      subtitle: 'For Hiring Managers',
      link: '/verify'
    }
  },
  {
    id: 'education',
    title: 'Secure Academic Credentials',
    description: 'Universities and educational institutions can issue tamper-proof digital diplomas and certificates that students own and control forever.',
    icon: AcademicCapIcon,
    visual: {
      icon: ShieldCheckIcon,
      title: 'Tamper-Proof Certificates',
      description: 'Blockchain-secured academic credentials'
    },
    benefits: [
      {
        title: 'Issue fraud-resistant digital diplomas',
        description: 'Blockchain technology prevents credential tampering'
      },
      {
        title: 'Students own their credentials permanently',
        description: 'No dependency on institution systems or databases'
      },
      {
        title: 'Instant verification for employers worldwide',
        description: 'Global accessibility without intermediaries'
      },
      {
        title: 'Reduce administrative overhead by 80%',
        description: 'Automated issuance and verification processes'
      }
    ],
    stats: [
      { value: '200+', label: 'Institutions' },
      { value: '80%', label: 'Cost Savings' },
      { value: '24/7', label: 'Availability' }
    ],
    cta: {
      text: 'Start Issuing Credentials',
      subtitle: 'Join leading universities',
      link: '/register'
    }
  },
  {
    id: 'professional',
    title: 'Professional Development Tracking',
    description: 'Professionals can build comprehensive skill portfolios with verifiable certifications from courses, bootcamps, and training programs.',
    icon: BriefcaseIcon,
    visual: {
      icon: ClockIcon,
      title: 'Continuous Learning',
      description: 'Track and verify your professional growth'
    },
    benefits: [
      {
        title: 'Build a comprehensive skill portfolio',
        description: 'Aggregate credentials from multiple sources'
      },
      {
        title: 'Showcase verified competencies to employers',
        description: 'Stand out with blockchain-verified skills'
      },
      {
        title: 'Track continuous learning journey',
        description: 'Visual representation of professional development'
      },
      {
        title: 'Portable credentials across platforms',
        description: 'Your credentials work everywhere, always'
      }
    ],
    stats: [
      { value: '50K+', label: 'Professionals' },
      { value: '10x', label: 'Faster Hiring' },
      { value: 'Forever', label: 'Credential Lifetime' }
    ],
    cta: {
      text: 'Build Your Portfolio',
      subtitle: 'Start with existing credentials',
      link: '/register'
    }
  }
]

const currentTab = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value) || tabs[0]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.the-h2 {
  color: #ffffff;
  background-image: linear-gradient(45deg, #f7e6cc, #ffffff 50%, #ffaa5a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.the-h3 {
  color: #ffffff;
  background-image: linear-gradient(45deg, #f7e6cc, #ffffff 70%, #ffaa5a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>