// app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBzefdTOJOnBVAA-3n0JaFTUG2ZggohYvE",
    authDomain: "learn-dt360.firebaseapp.com",
    projectId: "learn-dt360",
    storageBucket: "learn-dt360.firebasestorage.app",
    messagingSenderId: "525299508789",
    appId: "1:525299508789:web:ebf2f93b38ab0db534b37c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
