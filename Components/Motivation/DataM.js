import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCnFgERhszXtZIsQ0N4ju3wUMZRbfgtF8U",
  authDomain: "pulsepod-9d1c8.firebaseapp.com",
  projectId: "pulsepod-9d1c8",
  storageBucket: "pulsepod-9d1c8.firebasestorage.app",
  messagingSenderId: "613595484600",
  appId: "1:613595484600:web:ecd1f18e34ac758f203f4d"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
//References
let title = document.getElementById("Motivation-Container-add-Tab-Title");
let motivation = document.getElementById("Motivation-Container-add-Tab-motivation");
let Author = document.getElementById("Motivation-Container-add-Tab-Author");
let type = document.getElementById("Motivation-type");
//btns
let submitbtn = document.getElementById("motivation-submit-button");
//Functions
//Add In FireStore
async function AddMotivation_AutoID(){
    let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const ref = collection(db, "TheMotivationList");

    await addDoc(ref, {
        Title: title.value,
        Motivation: motivation.value,
        Author: Author.value,
        Type: type.value,
        UserEmail: userCreds.email 
    })
    .then(()=>{
        const target = document.querySelector(".home-navigation");
        const t2 = document.getElementById("Motivation-add-ref");
        target.style.backgroundColor = "lime";
        t2.textContent = "Added!";
    
        setTimeout(() => {
           target.style.backgroundColor = ""; 
           t2.textContent = "Motivations";
        }, 1500);
    })
    .catch((er)=>{
        alert("Data adding Failed"+er);
    });

    document.querySelector(".Motivation-Container-list").style.display = "flex";
    document.querySelector(".Motivation-Container-add-Tab").style.display = "none";
}
//Getting all data at once
function getAllDataRealTime() {
    const ref = collection(db, "TheMotivationList");
    const userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const sortSelect = document.getElementById("Motivation-sort-btn");
    const selectedType = sortSelect.value;

    onSnapshot(ref, (snapshot) => {
        const container = document.querySelector(".Motivation-Container-list");
        container.innerHTML = ""; 

        snapshot.forEach((doc) => {
            const data = doc.data();
            const motivationType = data.Type;

            
            if (selectedType === "All" || motivationType === selectedType) {
                
                const deleteButton = data.UserEmail === userCreds.email 
                    ? `<img src="/assets/dustbin (1).png" alt="Delete" title="Delete" class="Motivation-item-delete-btn" width="35px" height="35px">` 
                    : '';

                const itemHTML = `
                    <div class="Motivation-Container-list-out item" data-id="${doc.id}">
                        <div class="Motivation-Container-list-out-top">
                            ${deleteButton}
                            <h1>${data.Title}</h1>
                        </div>
                        <p>${data.Motivation}</p>
                        <div class="Motivation-Container-list-out-bot">
                            <h4>Type: ${data.Type}</h4>
                            <small>Submitted by: ${data.UserEmail}</small>
                            <h3>by ${data.Author}</h3>
                        </div>
                    </div>
                `;

                container.innerHTML += itemHTML;
            }
        });

        // Add event listener for delete buttons
        const deleteButtons = document.querySelectorAll(".Motivation-item-delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function(e) {
                const item = e.target.closest('.item'); 
                const itemId = item.getAttribute('data-id');
                
                deleteMotivation(itemId);
            });
        });
    });
}
document.getElementById("Motivation-sort-btn").addEventListener("change", function() {
    getAllDataRealTime();
});
function deleteMotivation(itemId) {
    const motivationRef = doc(db, "TheMotivationList", itemId);
    deleteDoc(motivationRef)
        .then(() => {
            console.log(`Your Motivation has been deleted!`);
        })
        .catch((error) => {
            console.error("Error deleting motivation: ", error);
        });
}
//Events
window.addEventListener("load", getAllDataRealTime);
submitbtn.addEventListener("click",AddMotivation_AutoID);
