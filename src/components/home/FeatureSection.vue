<script setup lang="ts">
import { ShieldCheckIcon, BoltIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline';

const features = [
    {
        icon: ShieldCheckIcon,
        title: "Immutable Records",
        description: "All credentials stored on Polygon blockchain for maximum security and transparency"
    },  
    {
        icon: BoltIcon,
        title: "Instant Verification",
        description: "Scan QR codes to validate credentials in seconds, not weeks"
    },  
    {
        icon: GlobeAltIcon,
        title: "Decentralized Trust",
        description: "No single point of failure or control"
    }
]

const roles = [
    {
        icon: AcademicCapIcon,
        title: "Issuers",
        description: "Universities, bootcamps, and training providers can issue tamper-proof certificates",
    },
    {
        icon: UserIcon,
        title: "Users", 
        description: "Professionals own and control their verifiable credentials",
    },
    {
        icon: BuildingOfficeIcon,
        title: "Verifiers",
        description: "Employers can instantly verify credentials without registration", 
    }
]
</script>

<template>
    <section id="features" class="border-t-[1px] border-[#3a3631] rounded-4xl relative isolate overflow-hidden pt-20 pb-14">
        
        <svg class="absolute inset-0 -z-10 h-full w-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
            <defs>
                <pattern id="features-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                    <path d="M.5 200V.5H200" fill="none" />
                </pattern>
            </defs>
            <svg x="50%" y="-1" class="overflow-visible fill-[#2a2622]/10">
                <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
            </svg>
            <rect width="100%" height="100%" stroke-width="0" fill="url(#features-pattern)" />
        </svg>


        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            
            <div class="mx-auto max-w-2xl text-center mb-16">
                <h2 class="features-title text-4xl font-bold tracking-tight sm:text-5xl">
                    Why Choose Our Platform
                </h2>
                <p class="mt-6 text-lg leading-8 text-[#d1c9c1]">
                    Built with cutting-edge blockchain technology to revolutionize credential verification
                </p>
            </div>

            
            <div class="mx-auto max-w-5xl">
                <div class="grid md:grid-cols-3 gap-8 mb-20">
                    <div v-for="feature in features" 
                         class="feature-card group relative rounded-xl p-8 transition-all duration-300 hover:scale-105">
                        
                        <div class="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm ring-1 ring-[#e6902e]/20"></div>
                        
                        
                        <div class="relative mb-6">
                            <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-[#e6902e] to-[#f7b955] shadow-lg">
                                <component :is="feature.icon" class="h-7 w-7 text-white" />
                            </div>
                        </div>

                        
                        <div class="relative">
                            <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-[#f7b955] transition-colors">
                                {{ feature.title }}
                            </h3>
                            <p class="text-[#d1c9c1] leading-relaxed">
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>

                
                <div class="relative">
                    
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a1612]/80 to-[#2a2622]/60 backdrop-blur-sm ring-1 ring-[#e6902e]/20"></div>
                    
                    
                    <div class="relative p-8 md:p-12">
                        <div class="text-center mb-12">
                            <h2 class="roles-title text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                Built for Everyone
                            </h2>
                            <p class="text-lg text-[#d1c9c1]">
                                Our platform serves every participant in the credentialing ecosystem
                            </p>
                        </div>

                        <div class="grid md:grid-cols-3 gap-8">
                            <div v-for="role in roles" class="role-card group text-center">
                                
                                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#e6902e] to-[#f7b955] shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <component :is="role.icon" class="h-8 w-8 text-white" />
                                </div>

                                
                                <h4 class="text-xl font-semibold text-white mb-3">{{ role.title }}</h4>
                                <p class="text-[#d1c9c1] text-sm leading-relaxed mb-6">{{ role.description }}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
#features {
     background-color: #1f1d2c;
     background: linear-gradient(180deg, #1a1612 0%, rgba(54, 27, 46, 0.171) 100%);
}

.features-title {
    color: #ffffff; 
    background-image: linear-gradient(45deg, #f7e6cc, #ffffff 50%, #e6902e 100%); 
    background-clip: text; 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
}

.roles-title {
    color: #ffffff; 
    background-image: linear-gradient(45deg, #f7b955, #ffffff 50%, #e6902e 100%); 
    background-clip: text; 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
}

.feature-card {
    backdrop-filter: blur(16px);
}

.feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    background: linear-gradient(45deg, transparent, rgba(230, 144, 46, 0.2), transparent);
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
}

.role-card {
    padding: 1.5rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
}

.role-card:hover {
    background: rgba(230, 144, 46, 0.05);
}
</style>