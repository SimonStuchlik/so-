// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getFirestore, doc, addDoc, collection, getDocs, onSnapshot, deleteDoc, updateDoc} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVm7jnT6IYE_hraWPb4iXoBR3_1w3fi8Q",
  authDomain: "pilar-43cce.firebaseapp.com",
  projectId: "pilar-43cce",
  storageBucket: "pilar-43cce.appspot.com",
  messagingSenderId: "80530544779",
  appId: "1:80530544779:web:8217386d45533751741c8e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
export const db = getFirestore();

export{doc, addDoc, collection, getDocs, onSnapshot, deleteDoc, updateDoc}