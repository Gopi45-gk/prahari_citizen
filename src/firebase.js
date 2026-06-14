import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0Z2ApzasR34lRQY6BbJEVJC56oF_UL4c",
  authDomain: "prahari-909dc.firebaseapp.com",
  projectId: "prahari-909dc",
  storageBucket: "prahari-909dc.firebasestorage.app",
  messagingSenderId: "194577169136",
  appId: "1:194577169136:web:e8d403fe514cc20e116035"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
