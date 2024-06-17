// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth}    from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getDatabase, ref,set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuKMAeSzmQ0_3A4Ql1DG-eQZuJXk95e7Q",
  authDomain: "testeapp-b3ce6.firebaseapp.com",
  databaseURL:"https://testeapp-b3ce6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testeapp-b3ce6",
  storageBucket: "testeapp-b3ce6.appspot.com",
  messagingSenderId: "471736725776",
  appId: "1:471736725776:web:23a270bf725c54cacaf595",
  measurementId: "G-PGXEXXDGYB",
  
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB= getFirestore(FIREBASE_APP);
export const database=getDatabase(FIREBASE_APP);



