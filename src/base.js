// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO8x-YCP0Gz7k4lBQg_aOEx6HJtYKuooU",
  authDomain: "shoppingcart-e7f15.firebaseapp.com",
  projectId: "shoppingcart-e7f15",
  storageBucket: "shoppingcart-e7f15.appspot.com",
  messagingSenderId: "503776281215",
  appId: "1:503776281215:web:53d636413735fd28e0754a",
  measurementId: "G-LX3E6J3VWY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
