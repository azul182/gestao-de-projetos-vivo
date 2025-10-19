// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfLAFrCtAffOYwu5pYViG28BySXSi689M",
  authDomain: "seletor-de-demandas.firebaseapp.com",
  projectId: "seletor-de-demandas",
  storageBucket: "seletor-de-demandas.firebasestorage.app",
  messagingSenderId: "91887368823",
  appId: "1:91887368823:web:c90a04a1a90453a2f86472",
  databaseURL: "https://seletor-de-demandas-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
export { auth, database };