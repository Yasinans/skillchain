import { db } from "../firebase";
import { query, where, orderBy, updateDoc, doc, collection, getDoc, getDocs, setDoc, DocumentReference, Timestamp } from "firebase/firestore";
import type { Credential } from "../types/credentials.type";
import { getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { useUserStore } from "../stores/user";

interface CredentialData {
    txHash: string;
    credentialId: number;
    issuerAddress: string;
    recipientAddress: string;
    credentialName: string;
    description: string;
    skillLevel: string;
    expiryDate: string;
    additionalNotes: string;
    certificateUrl?: string;
    originalIssuedAt?: string;
}

export async function useDB() {
    const checkUserExists = async (address: string) => {
        try {
            const userDocRef = doc(db, "users", address);
            const userDoc = await getDoc(userDocRef);
            return userDoc.exists();
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    }

    const getUserData = async (address: string) => {
        try {
            const userDocRef = doc(db, "users", address);
            const userDoc = await getDoc(userDocRef);
            return {
                name: userDoc.data()?.name,
                email: userDoc.data()?.email
            };
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }
    const isIssuerVerified = async (address: string) => {
        try {
            const issuerDocRef = doc(db, "issuers", address);
            const issuerDoc = await getDoc(issuerDocRef);
            return issuerDoc.data()?.isVerified;
        } catch (error) {
            console.error('Error getting issuer verification status:', error);
            return null;
        }
    }
    const checkEmailExists = async (email: string) => {
        try {
            const emailDocRef = doc(db, "emails", email);
            const emailDoc = await getDoc(emailDocRef);
            return emailDoc.exists();
        } catch (error) {
            console.error('Error checking email existence:', error);
            return false;
        }
    }

    const isIssuer = async (address: string) => {
        try {
            const issuerDocRef = doc(db, "issuers", address);
            const issuerDoc = await getDoc(issuerDocRef);
            return issuerDoc.exists();
        } catch (error) {
            console.error("Error checking issuer existence:", error);
            return false;
        }
    }

    const createIssuer = async (organizationName: string) => {
        if (!getAuth().currentUser) return false;
        try {
            const uid = getAuth().currentUser?.uid || '';
            const issuerDocRef = doc(db, "issuers", uid);
            await setDoc(issuerDocRef, {
                organizationName: organizationName,
                isVerified: false
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    const createUser = async (name: string, email: string, isIssuer = false) => {
        if (!getAuth().currentUser) return false;
        try {
            const emailExists = await checkEmailExists(email);
            if (emailExists) throw new Error('Email already exists');
            const uid = getAuth().currentUser?.uid || '';
            const userDocRef = doc(db, "users", uid);
            await setDoc(userDocRef, {
                name: name,
                email: email,
                isEmailVerified: false
            });
            const emailDocRef = doc(db, "emails", email.toLowerCase());
            await setDoc(emailDocRef, { uid: uid });
            if (isIssuer) await createIssuer(name);
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }

    const revokeCredentialInFirestore = async (txHash: string, recipientAddress: string) => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });

            const credentialDocRef = doc(db, "users", recipientAddress.toLowerCase(), "credentials", txHash);
            await setDoc(credentialDocRef, {
                status: false
            }, { merge: true });
            await useUserStore().loadCredentials();
            return true;
        } catch (error) {
            console.error('Error revoking credential in Firestore:', error);
            throw error;
        }
    };

    const issueCredentialToFirestore = async (credentialData: CredentialData) => {
    try {
        await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    unsubscribe();
                    resolve(user);
                }
            });
        });
        const {
            txHash,
            credentialId,
            issuerAddress,
            recipientAddress,
            credentialName,
            description,
            skillLevel,
            expiryDate,
            additionalNotes,
            certificateUrl,
            originalIssuedAt // ✅ Get the original timestamp
        } = credentialData;

        // ✅ Use original timestamp if provided, otherwise use current time
        const issuedDate = originalIssuedAt 
            ? Timestamp.fromDate(new Date(originalIssuedAt))
            : Timestamp.now();
            
        const canExpire = !!expiryDate;
        const expiryTimestamp = expiryDate ? Timestamp.fromDate(new Date(expiryDate)) : null;

        const credentialDocRef = doc(db, "users", recipientAddress.toLowerCase(), "credentials", txHash);
        const issuerRef = doc(db, "issuers", issuerAddress.toLowerCase());
        
        await setDoc(credentialDocRef, {
            credentialName,
            description,
            additionalNotes,
            canExpire,
            expiryDate: expiryTimestamp,
            issuedDate, // ✅ Now uses the same timestamp as blockchain hash
            issuer: issuerRef,
            skillLevel,
            status: true,
            certificateUrl: certificateUrl || null,
            txHash,
            credentialId,
            originalIssuedAt // ✅ Store the original ISO string for easy access
        });

        const issuedCredRef = doc(db, "issuers", issuerAddress.toLowerCase(), "issuedCredentials", txHash.toLowerCase());
        await setDoc(issuedCredRef, {
            credRef: credentialDocRef,
            issuedDate,
            recipientAddress
        });
        
        await useUserStore().loadCredentials();
        return true;
    } catch (error) {
        console.error('Error issuing credential to Firestore:', error);
        throw error;
    }
};
    const getIssuedCredentials = async (address: string) => {
        try {
            const issuedCredsRef = collection(db, "issuers", address, "issuedCredentials");
            const issuedCredsDocs = await getDocs(issuedCredsRef);
            const credsRefs = issuedCredsDocs.docs.map(doc => doc.data().credRef as DocumentReference);
            const credentials = [] as Credential[];
            for (const docRef of credsRefs) {
                try {
                    const doc = await getDoc(docRef);
                    if (!doc.exists()) continue;
                    const orgRef = doc.data().issuer as DocumentReference;
                    const orgSnap = await getDoc(orgRef);
                    if (!orgSnap.exists()) continue;
                    credentials.push({
                        id: doc.id,
                        credentialId: doc.data().credentialId,
                        credentialName: doc.data().credentialName,
                        description: doc.data().description,
                        organizationName: orgSnap.data().organizationName,
                        holder: docRef.path.split("/")[1],
                        issuer: orgSnap.id,
                        issuedDate: doc.data().issuedDate.toDate(),
                        canExpire: doc.data().canExpire,
                        expiryDate: doc.data().expiryDate?.toDate(),
                        skillLevel: doc.data().skillLevel,
                        status: doc.data().status,
                        certificateUrl: doc.data().certificateUrl
                    });
                } catch (error) {
                    continue;
                }

            }

            return credentials;
        } catch (error) {
            console.error('Error getting issued credentials:', error);
            return [];
        }
    }

    const getCredentials = async (address: string) => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });
            const credsRef = collection(db, "users", address.toLowerCase(), "credentials");
            const snapshot = await getDocs(credsRef);
            const credentials = [] as Credential[];
            for (const doc of snapshot.docs) {
                const orgRef = doc.data().issuer as DocumentReference;
                const orgSnap = await getDoc(orgRef);
                if (!orgSnap.exists()) continue;
                credentials.push({
                    id: doc.id,
                    credentialId: doc.data().credentialId,
                    credentialName: doc.data().credentialName,
                    description: doc.data().description,
                    notes: doc.data().additionalNotes,
                    organizationName: orgSnap.data().organizationName,
                    holder: address,
                    issuer: orgSnap.id,
                    issuedDate: doc.data().issuedDate.toDate(),
                    canExpire: doc.data().canExpire,
                    expiryDate: doc.data().expiryDate?.toDate(),
                    skillLevel: doc.data().skillLevel,
                    status: doc.data().status,
                    certificateUrl: doc.data().certificateUrl
                });
            }

            return credentials;
        } catch (error) {
            console.error('Error getting credentials:', error);
            return [];
        }
    }

    const signInWithWallet = async (customToken: string) => {
        try {
            const auth = getAuth();
            const userCredential = await signInWithCustomToken(auth, customToken);
            const idToken = await userCredential.user.getIdToken();
            return idToken;
        } catch (error) {
            console.error('Error signing in with wallet:', error);
        }
    }
    //for sharing qr
    interface SharedCredentialData {
        shareId: string;
        owner: string;
        credentialIds: string[];
        createdAt: Timestamp;
        expiryDate?: Timestamp | null;
        maxAccessCount?: number | null;
        accessCount: number;
        isActive: boolean;
        description?: string | null;
        lastAccessedAt?: Timestamp | null;
        revokedAt?: Timestamp | null;
    }

    // Add these functions to the return object of useDB()
    const createSharedCredential = async (shareData: {
        shareId: string;
        credentialIds: string[];
        expiryDate?: Date;
        description?: string;
        maxAccessCount?: number;
    }): Promise<boolean> => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });

            const currentUser = getAuth().currentUser;
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            const shareDocRef = doc(db, "sharedCredentials", shareData.shareId);
            const sharedCredentialData: SharedCredentialData = {
                shareId: shareData.shareId,
                owner: currentUser.uid,
                credentialIds: shareData.credentialIds,
                createdAt: Timestamp.now(),
                expiryDate: shareData.expiryDate ? Timestamp.fromDate(shareData.expiryDate) : null,
                maxAccessCount: shareData.maxAccessCount || null,
                accessCount: 0,
                isActive: true,
                description: shareData.description || null,
                lastAccessedAt: null,
                revokedAt: null
            };

            await setDoc(shareDocRef, sharedCredentialData);
            return true;
        } catch (error) {
            console.error('Error creating shared credential:', error);
            return false;
        }
    };

    const getSharedCredentials = async (address: string) => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });

            // Try to get with orderBy, fallback to simple query if index doesn't exist
            let sharesSnapshot;
            try {
                const sharesQuery = query(
                    collection(db, "sharedCredentials"),
                    where("owner", "==", address.toLowerCase()),
                    orderBy("createdAt", "desc")
                );
                sharesSnapshot = await getDocs(sharesQuery);
            } catch (error) {
                console.warn('Composite index not available, using simple query:', error);
                // Fallback to simple query without orderBy
                const sharesQuery = query(
                    collection(db, "sharedCredentials"),
                    where("owner", "==", address.toLowerCase())
                );
                sharesSnapshot = await getDocs(sharesQuery);
            }

            const sharedCredentials = [];
            const now = new Date();

            for (const docSnapshot of sharesSnapshot.docs) {
                const data = docSnapshot.data() as SharedCredentialData;

                const isExpired = data.expiryDate && data.expiryDate.toDate() <= now;
                const hasReachedLimit = data.maxAccessCount && data.accessCount >= data.maxAccessCount;

                sharedCredentials.push({
                    id: data.shareId,
                    shareId: data.shareId,
                    dateShared: data.createdAt.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    credentialIds: data.credentialIds,
                    credentials: [], // Will be populated by the composable
                    isActive: data.isActive && !isExpired && !hasReachedLimit,
                    expiryDate: data.expiryDate?.toDate()?.toISOString() || undefined,
                    description: data.description || undefined,
                    accessCount: data.accessCount,
                    maxAccessCount: data.maxAccessCount || undefined,
                    createdAt: data.createdAt.toDate().toISOString(),
                    lastAccessedAt: data.lastAccessedAt?.toDate()?.toISOString() || undefined,
                    revokedAt: data.revokedAt?.toDate()?.toISOString() || undefined
                });
            }

            // Sort by creation date in JavaScript if we couldn't use orderBy
            sharedCredentials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return sharedCredentials;
        } catch (error) {
            console.error('Error getting shared credentials:', error);
            return [];
        }
    };

    const revokeSharedCredential = async (shareId: string, userAddress: string): Promise<boolean> => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });

            const shareDocRef = doc(db, "sharedCredentials", shareId);
            const shareDoc = await getDoc(shareDocRef);

            if (!shareDoc.exists()) {
                console.error('Share not found');
                return false;
            }

            const shareData = shareDoc.data() as SharedCredentialData;

            // Check ownership
            if (shareData.owner !== userAddress.toLowerCase()) {
                console.error('User does not have permission to revoke this share');
                return false;
            }

            // Update the document to mark as inactive
            await updateDoc(shareDocRef, {
                isActive: false,
                revokedAt: Timestamp.now()
            });

            return true;
        } catch (error) {
            console.error('Error revoking shared credential:', error);
            return false;
        }
    };

    const verifySharedCredential = async (shareId: string) => {
        try {
            const shareDocRef = doc(db, "sharedCredentials", shareId);
            const shareDoc = await getDoc(shareDocRef);

            if (!shareDoc.exists()) {
                return null;
            }

            const shareData = shareDoc.data() as SharedCredentialData;
            const now = new Date();

            // Check if share is active
            if (!shareData.isActive) {
                return { error: 'This share has been revoked', code: 'SHARE_REVOKED' };
            }

            // Check expiry
            if (shareData.expiryDate && shareData.expiryDate.toDate() <= now) {
                return { error: 'This share has expired', code: 'SHARE_EXPIRED' };
            }

            // Check access limit
            if (shareData.maxAccessCount && shareData.accessCount >= shareData.maxAccessCount) {
                return { error: 'Access limit reached for this share', code: 'ACCESS_LIMIT_REACHED' };
            }

            // Update access count and last accessed time
            await updateDoc(shareDocRef, {
                accessCount: shareData.accessCount + 1,
                lastAccessedAt: Timestamp.now()
            });

            return {
                success: true,
                shareInfo: {
                    shareId: shareData.shareId,
                    owner: shareData.owner,
                    credentialIds: shareData.credentialIds,
                    createdAt: shareData.createdAt.toDate().toISOString(),
                    expiryDate: shareData.expiryDate?.toDate()?.toISOString() || undefined,
                    description: shareData.description || undefined,
                    accessCount: shareData.accessCount + 1, // Include the current access
                    maxAccessCount: shareData.maxAccessCount || undefined,
                    isExpired: false
                }
            };
        } catch (error) {
            console.error('Error verifying shared credential:', error);
            return { error: 'Failed to verify credentials', code: 'VERIFICATION_FAILED' };
        }
    };

    const getSharedCredentialStats = async (address: string) => {
        try {
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        unsubscribe();
                        resolve(user);
                    }
                });
            });

            const sharesQuery = query(
                collection(db, "sharedCredentials"),
                where("owner", "==", address.toLowerCase())
            );
            const snapshot = await getDocs(sharesQuery);

            const now = new Date();
            let totalShares = 0;
            let activeShares = 0;
            let expiredShares = 0;
            let revokedShares = 0;
            let totalAccess = 0;

            snapshot.forEach(doc => {
                const data = doc.data() as SharedCredentialData;
                totalShares++;
                totalAccess += data.accessCount || 0;

                if (!data.isActive) {
                    revokedShares++;
                } else if (data.expiryDate && data.expiryDate.toDate() <= now) {
                    expiredShares++;
                } else if (data.maxAccessCount && data.accessCount >= data.maxAccessCount) {
                    expiredShares++;
                } else {
                    activeShares++;
                }
            });

            return {
                totalShares,
                activeShares,
                expiredShares,
                revokedShares,
                totalAccess
            };
        } catch (error) {
            console.error('Error getting shared credential stats:', error);
            return {
                totalShares: 0,
                activeShares: 0,
                expiredShares: 0,
                revokedShares: 0,
                totalAccess: 0
            };
        }
    };
    return {
        createUser,
        isIssuer,
        checkUserExists,
        isIssuerVerified,
        signInWithWallet,
        getCredentials,
        getUserData,
        getIssuedCredentials,
        issueCredentialToFirestore,
        revokeCredentialInFirestore,
        createSharedCredential,
        getSharedCredentials,
        revokeSharedCredential,
        verifySharedCredential,
        getSharedCredentialStats
    };
}