// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-y75uUn5dTPoTzSGar1NHRK9YaEZMDfU",
  authDomain: "evciailo.firebaseapp.com",
  projectId: "evciailo",
  storageBucket: "evciailo.firebasestorage.app",
  messagingSenderId: "263152357253",
  appId: "1:263152357253:web:474c43a65342c3d3157eec",
  measurementId: "G-MZLH10EM9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
