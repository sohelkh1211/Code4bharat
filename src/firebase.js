import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfigUser = {
  apiKey: "AIzaSyBG2dFEYOF6I8gEAXVDu56Mm22-7lXTUKI",
  authDomain: "code4bharat-assignment.firebaseapp.com",
  projectId: "code4bharat-assignment",
  storageBucket: "code4bharat-assignment.appspot.com",
  messagingSenderId: "672217424872",
  appId: "1:672217424872:web:49522104013bd01444ba5d",
  measurementId: "G-YTTFE4V2YD"
};

const firebaseConfigAdmin = {
  apiKey: "AIzaSyB5pp_Ubup_0r0nSlbl2b8Pq6HIQ9LPTfQ",
  authDomain: "propane-primacy-422618-k8.firebaseapp.com",
  projectId: "propane-primacy-422618-k8",
  storageBucket: "propane-primacy-422618-k8.appspot.com",
  messagingSenderId: "593086990153",
  appId: "1:593086990153:web:7c812ef28dfc0244d67c98",
  measurementId: "G-6DP3845GLH"
};

// Initialize Firebase
const userApp = initializeApp(firebaseConfigUser, "userApp");
const userAuth = getAuth(userApp);
const userDB = getDatabase(userApp);
const userStorage = getStorage(userApp);
const userAnalytics = getAnalytics(userApp);

const adminApp = initializeApp(firebaseConfigAdmin, "adminApp");
const admminAuth = getAuth(adminApp);
const adminDB = getDatabase(adminApp);
const adminStorage = getStorage(adminApp);
const adminAnalytics = getAnalytics(adminApp);


export { userApp, userAuth, userDB, userStorage, adminApp, admminAuth, adminDB, adminStorage  };