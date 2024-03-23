import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-app-8d012.firebaseapp.com",
  projectId: "estate-app-8d012",
  storageBucket: "estate-app-8d012.appspot.com",
  messagingSenderId: "955157138961",
  appId: "1:955157138961:web:e506bc8754bbefb1d3abb0",
};

export const app = initializeApp(firebaseConfig);
