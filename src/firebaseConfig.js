// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWEg9wod_9ZeQtaMVsj6SF4RfA0_UKACg",
  authDomain: "evcia1.firebaseapp.com",
  projectId: "evcia1",
  storageBucket: "evcia1.appspot.com",
  messagingSenderId: "604168969295",
  appId: "1:604168969295:web:d57feb6fe69b418e3085e2",
  measurementId: "G-6PWNMNKLDZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
