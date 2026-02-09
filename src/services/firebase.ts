// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar getAuth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1bfervGERxLbR7OZUAkqGNo4PA6C7gIk",
  authDomain: "atomo-quantico-2f81f.firebaseapp.com",
  projectId: "atomo-quantico-2f81f",
  storageBucket: "atomo-quantico-2f81f.firebasestorage.app",
  messagingSenderId: "434005661",
  appId: "1:434005661:web:25d362c018cec19ef49674",
  measurementId: "G-04H8W8HC2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializar o Auth

export { app, analytics, db, auth }; // Exportar o Auth
