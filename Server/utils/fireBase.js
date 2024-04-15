// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFeiVQQmKX-SYs37C0Tn2sNMh3g77UKH8",
  authDomain: "music-world-application.firebaseapp.com",
  projectId: "music-world-application",
  storageBucket: "music-world-application.appspot.com",
  messagingSenderId: "63564843000",
  appId: "1:63564843000:web:3b2a4008155360a97a780d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = firebaseConfig;
