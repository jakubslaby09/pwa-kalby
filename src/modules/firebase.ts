// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKz_6DZROjgArys0JqV1Jjh3_hmu1IcsE",
  authDomain: "kalby-pwa.firebaseapp.com",
  projectId: "kalby-pwa",
  storageBucket: "kalby-pwa.appspot.com",
  messagingSenderId: "990642738929",
  appId: "1:990642738929:web:04c8d11d6208554cbe7b50",

  databaseURL: "https://DATABASE_NAME.firebaseio.com",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// ;(window as any).firebase = app

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
;(window as any).auth = auth
onAuthStateChanged(auth, () => window.dispatchEvent(new Event('auth')))

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app)
// ;(window as any).database = database

async function login() {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)
    
    console.log(`uživatel přihlášen`, res)
}
(window as any).auth.login = login