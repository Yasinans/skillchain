import { defineStore } from "pinia";
import type { Credential } from "../types/credentials.type";
import { useDB } from "../composables/useDB";

interface UserState{
    address: string | null;
    name: string | null;
    email: string | null;
    isIssuer: boolean;
    isVerified: boolean;
    isRegistered: boolean;
    token: string | null;
    credentials: Credential[]
}

const convertDatesInCredentials = (credentials: Credential[]): Credential[] => {
    return credentials.map(cred => ({
        ...cred,
        issuedDate: cred.issuedDate instanceof Date ? cred.issuedDate : new Date(cred.issuedDate),
        expiryDate: cred.expiryDate ? (cred.expiryDate instanceof Date ? cred.expiryDate : new Date(cred.expiryDate)) : cred.expiryDate
    }));
};

export const useUserStore = defineStore("user", {
    persist: {
        serializer: {
            serialize: JSON.stringify,
            deserialize: (value) => {
                const parsed = JSON.parse(value);
                if (parsed.credentials && Array.isArray(parsed.credentials)) {
                    parsed.credentials = convertDatesInCredentials(parsed.credentials);
                }
                return parsed;
            }
        }
    },
    state: (): UserState => ({
        address: null,
        name: null,
        email: null,
        isIssuer: false,
        isVerified: false,
        isRegistered: false,
        token: null,
        credentials: []
    }),
    actions: {
        setUser(user: UserState) {
            this.address = user.address;
            this.name = user.name;
            this.email = user.email;
            this.token = user.token;
            this.isIssuer = user.isIssuer;
            this.isVerified = user.isVerified;
            this.isRegistered = user.isRegistered;
            this.credentials = convertDatesInCredentials(user.credentials);
        },
        setToken(token: string | null) {
            this.token = token;
        },
        async loadUserData(){
            if(!this.address || !this.isRegistered) return false;
            const { getUserData } = await useDB();
            const userData = await getUserData(this.address);
            if(!userData) return false;
            this.name = userData.name;
            this.email = userData.email;
        },
        async checkRegistration(){
            if(!this.address) return false;
            const { checkUserExists } = await useDB();
            this.isRegistered = await checkUserExists(this.address);
            return this.isRegistered;
        },
        async loadCredentials(){
            if(!this.address || !this.isRegistered) return false;
            const { getCredentials, getIssuedCredentials } = await useDB();
            const rawCredentials = this.isIssuer 
                ? await getIssuedCredentials(this.address)
                : await getCredentials(this.address);
            this.credentials = convertDatesInCredentials(rawCredentials);
        },
        clearUser() {
            this.name = null;
            this.email = null;
            this.address = null;
            this.isIssuer = false;
            this.token = null;
            this.isVerified = false;
            this.isRegistered = false;
            this.credentials = [];
        }
    }
});