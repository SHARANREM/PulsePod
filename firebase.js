import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnFgERhszXtZIsQ0N4ju3wUMZRbfgtF8U",
  authDomain: "pulsepod-9d1c8.firebaseapp.com",
  projectId: "pulsepod-9d1c8",
  storageBucket: "pulsepod-9d1c8.firebasestorage.app",
  messagingSenderId: "613595484600",
  appId: "1:613595484600:web:ecd1f18e34ac758f203f4d"
};
//Initialization for db
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);
//Getting Reference ID's for Registering
let Username = document.getElementById("username");
let EmailInp = document.getElementById("emails");
let PasswordInp = document.getElementById("passwords");
let RegisterBtn = document.getElementById("signin-btn-primary");
//Getting Reference ID's for Log in
let EmailInpLog = document.getElementById("emaill");
let PasswordInpLog = document.getElementById("passwordl");
let LoginBtn = document.getElementById("login-btn-primary");
//Registering User
let registerUser = event => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, EmailInp.value, PasswordInp.value)
        .then(async (credential) => {
            var ref = doc(db, "UserAuthList", credential.user.uid);
            await setDoc(ref, {
                Username: Username.value
            })
        }).then(()=>{
            alert("User Registered You can login now👍");
        })
        .catch((er) => {
            alert("Can't Register now."+er);
        })
};
//Login User
let SignInUser = evt => {
    evt.preventDefault();
    signInWithEmailAndPassword(auth, EmailInpLog.value, PasswordInpLog.value)
        .then(async (credential) => {
            var ref = doc(db, "UserAuthList", credential.user.uid);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                sessionStorage.setItem("user-insfo", JSON.stringify({
                    Username: docSnap.data().Username,
                }));
                sessionStorage.setItem("user-creds", JSON.stringify(credential.user));
                window.location.href = "Components/Home/Home.html";
            }

        }).catch((er) => {
            alert("Login Failed");
            console.log(er);
        })
};
//Btn Events
RegisterBtn.addEventListener("click",registerUser);
LoginBtn.addEventListener("click",SignInUser);