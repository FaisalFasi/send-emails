// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx37JtwJN0oAaY25e_OMt9c18vuEFFbVo",
  authDomain: "syrena-admin-email.firebaseapp.com",
  projectId: "syrena-admin-email",
  storageBucket: "syrena-admin-email.firebasestorage.app",
  messagingSenderId: "389480480168",
  appId: "1:389480480168:web:2cee80052ccbe92451319d",
};

// Initialize Firebase
const currentApps = getApps();

let auth: Auth;
let storage: FirebaseStorage;

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log("Firebase app already initialized");
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage };
