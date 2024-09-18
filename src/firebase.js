import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBG2dFEYOF6I8gEAXVDu56Mm22-7lXTUKI",
  authDomain: "code4bharat-assignment.firebaseapp.com",
  projectId: "code4bharat-assignment",
  storageBucket: "code4bharat-assignment.appspot.com",
  messagingSenderId: "672217424872",
  appId: "1:672217424872:web:49522104013bd01444ba5d",
  measurementId: "G-YTTFE4V2YD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage();
const analytics = getAnalytics(app);

export { app, auth, db, storage };