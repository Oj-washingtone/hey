import { initializeApp } from "firebase/app";
import "firebase/auth";

// firestore
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest?.extra?.firebaseApiKey,
  authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
  projectId: Constants.manifest?.extra?.firebaseProjectId,
  storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
  appId: Constants.manifest?.extra?.firebaseAppId,
  measurementId: Constants.manifest?.extra?.firebaseMeasurementId,
};

// console.log(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore database
export const db = getFirestore(app);

export default { app, db};
