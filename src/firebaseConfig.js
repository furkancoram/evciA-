// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmDzZ_KpqlJvDGyweEQ5gtJoBwsux2EKU",
  authDomain: "evciai-6ee17.firebaseapp.com",
  projectId: "evciai-6ee17",
  storageBucket: "evciai-6ee17.firebasestorage.app",
  messagingSenderId: "8963614199",
  appId: "1:8963614199:web:3ab1e9cf92afeda3cabaf2",
  measurementId: "G-Q40LMYBBKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
