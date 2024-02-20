// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeWVZ_kDmGQ86gvEBkwEe3Ry7T55DWHsE",
  authDomain: "iniso-49b07.firebaseapp.com",
  projectId: "iniso-49b07",
  storageBucket: "iniso-49b07.appspot.com",
  messagingSenderId: "945638314349",
  appId: "1:945638314349:web:186bc0fc8e079d8f71ca64",
  measurementId: "G-9KQG0NDME4"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);