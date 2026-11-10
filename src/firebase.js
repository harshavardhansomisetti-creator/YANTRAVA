import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnxLLlGcm81jdO-7EHqjCtAK8Jh1qaBc8",
  authDomain: "yantrava-fc142.firebaseapp.com",
  projectId: "yantrava-fc142",
  storageBucket: "yantrava-fc142.firebasestorage.app",
  messagingSenderId: "715822722361",
  appId: "1:715822722361:web:42c000f98b99b64d918ce8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();