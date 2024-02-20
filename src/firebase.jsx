// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVmnuBwW6v9wN1PAa843gjhNKkD4iPsQY",
    authDomain: "upload-93e39.firebaseapp.com",
    projectId: "upload-93e39",
    storageBucket: "upload-93e39.appspot.com",
    messagingSenderId: "1019584961584",
    appId: "1:1019584961584:web:adc3985e4dddfe7302e1f5",
    measurementId: "G-V26ZPTZDG9"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);