
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app) // provides dashboard for signup and login for you app dashboard give you glance of user who entred your app
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: 'select_account'
})
export async function googleAuth(params) {
    try {

        let data = await signInWithPopup(auth, provider)
        const idToken = await data.user.getIdToken();
        return {
            user:data?.user,
            idToken
        }
    } catch (error) {
        return error.message
    }

}