import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWEg9wod_9ZeQtaMVsj6SF4RfA0_UKACg",
  authDomain: "evciai.firebaseapp.com",
  projectId: "evciai",
  storageBucket: "evciai.appspot.com",
  messagingSenderId: "604168996295",
  appId: "1:604168996295:web:d57feb6fe69b418e3085e2",
  measurementId: "G-6PWENNKLDZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
