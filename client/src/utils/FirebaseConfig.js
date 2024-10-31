import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA8N8BldMiQ2xqrxr8LUggPrmI4ydGdMTo",
    authDomain: "whatsapp-2cde9.firebaseapp.com",
    projectId: "whatsapp-2cde9",
    storageBucket: "whatsapp-2cde9.appspot.com",
    messagingSenderId: "223962080917",
    appId: "1:223962080917:web:3753ea2c7c02ad2f389d9c",
    measurementId: "G-HH3NHH0L6L"
  };

  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app);