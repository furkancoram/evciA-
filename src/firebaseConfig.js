// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWEq9wod_9ZeQtaMVsj6SF4RfAO_UKACg",
  authDomain: "evciai.firebaseapp.com",
  projectId: "evciai",
  storageBucket: "evciai.firebasestorage.app",
  messagingSenderId: "604168996295",
  appId: "1:604168996295:web:d57feb6fe69b418e3085e2",
  measurementId: "G-6PWENNKLDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
