const firebaseConfig = {
  apiKey: "AIzaSyAy~75uUn5dTPoTzSGar1NHRKy9rEzMDFU",
  authDomain: "evciai.firebaseapp.com",
  projectId: "evciai",
  storageBucket: "evciai.appspot.com",
  messagingSenderId: "263153257523",
  appId: "1:263153257523:web:474c43a65342c3d3157eec",
  measurementId: "G-MZL1HE09MY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
