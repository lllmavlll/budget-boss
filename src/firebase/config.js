import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDb7Gsximn30o3ux8iWQpVoPf0XyiI5aLE",
  authDomain: "budget-boss-6d33c.firebaseapp.com",
  projectId: "budget-boss-6d33c",
  storageBucket: "budget-boss-6d33c.appspot.com",
  messagingSenderId: "872202970594",
  appId: "1:872202970594:web:a925b22263c4ecd5f8c5bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
