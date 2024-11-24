import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs,
    setDoc, 
    updateDoc, 
    addDoc, 
    deleteDoc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
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

// References
const title = document.getElementById("Health-hub-add-tip-title-input");
const description = document.getElementById("Health-hub-add-tip-description-input");
const type = document.getElementById("Health-hub-add-tip-type-input");
const level = document.getElementById("Health-hub-add-tip-Level-input");
const submitbtn = document.getElementById("Health-hub-tip-submit-btn");
const deleteMyTipsBtn = document.getElementById("Health-hub-delete-my-tips");
const viewMyTipsBtn = document.getElementById("Health-hub-view-my-tips");
const filterByTypeBtn = document.getElementById("Health-hub-filter-by-type");
const filterByLevelBtn = document.getElementById("Health-hub-filter-by-rating");
const expandedContainer = document.querySelector(".Health-hub-container-expanded");
const closeBtn = document.getElementById("Health-hub-container-expanded-close-btn");
const searchBar = document.getElementById("Health-hub-search-bar");
const gridContainer = document.querySelector(".Health-hub-container-grid");

// User Info
const userCreds = JSON.parse(sessionStorage.getItem("user-creds")) || { email: "anonymous@example.com" };

// Add Tip to Firestore
async function AddHealthtip_AutoID() {
    const userInfo = JSON.parse(sessionStorage.getItem("user-insfo")) || {};
    const ref = collection(db, "HealthTipList");

    await addDoc(ref, {
        Title: title.value,
        Description: description.value,
        Type: type.value,
        Level: level.value,
        UserName: userInfo.Username || "Anonymous",
        UserEmail: userCreds.email
    })
    .then(() => {
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "lime";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1500);
    })
    .catch((err) => {
        alert("Data adding failed: " + err);
    });

    document.getElementById("Health-hub-container-grid-list-changer").style.display = "";
    document.querySelector(".Health-hub-container-add-slide").style.display = "none";
}
function RenderTips() {
    const ref = collection(db, "HealthTipList");

    // Real-time listener for Firestore collection
    onSnapshot(ref, (snapshot) => {
        gridContainer.innerHTML = ""; // Clear grid before rendering

        snapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;

            // Create the tip card with `onclick` to pass data
            const item = `
                <div 
                    class="Health-hub-tip" 
                    onclick="handleTipClick('${data.Title}', '${data.Description}', '${data.Type}', '${data.Level}', '${data.UserName}', '${data.UserEmail}')">
                    <h1 id="Health-hub-tip-title-display">${data.Title}</h1>
                    <h2 id="Health-hub-tip-description-display">${data.Description}</h2>
                    <div class="Health-hub-tip-details">
                        <button id="Health-hub-tip-type-display">${data.Type}</button>
                        <button id="Health-hub-tip-level-btn-display">${data.Level}</button>
                    </div>
                    <h3 id="Health-hub-tip-username-display">${data.UserName}</h3>
                </div>
            `;

            gridContainer.insertAdjacentHTML("beforeend", item);
        });
    });
}
// Function to Delete All Tips for the Logged-In User
async function deleteAllUserTips() {
    const userEmail = userCreds.email; // Get the logged-in user's email
    const ref = collection(db, "HealthTipList"); // Reference to the collection

    try {
        const snapshot = await getDocs(ref);

        const deletePromises = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.UserEmail === userEmail) {
                deletePromises.push(deleteDoc(doc.ref));
            }
        });

        await Promise.all(deletePromises);
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "lime";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1000);
        console.log("Deleted all tips for user:", userEmail);
    } catch (error) {
        console.error("Error deleting tips:", error);
        alert("Failed to delete tips: " + error.message);
    }
}
let idDisplaying = false;
async function viewMyTips() {
    const userEmail = userCreds.email; 
    const ref = collection(db, "HealthTipList");
    if(!idDisplaying){
        try {
            // Query Firestore to get documents where UserEmail matches
            const snapshot = await getDocs(ref);
            const userTips = snapshot.docs.filter((doc) => doc.data().UserEmail === userEmail);

            // Clear the grid and display only the user's tips
            gridContainer.innerHTML = ""; // Clear the container

            if (userTips.length === 0) {
                gridContainer.innerHTML = "<p style=\"font-family: 'Kodchasan', sans-serif; color: white;\">No tips found for the current user.</p>";
                idDisplaying = true;
                return;
            }
            // Render each tip in the grid
            userTips.forEach((doc) => {
                const data = doc.data();

                const item = `
                    <div 
                        class="Health-hub-tip" 
                        onclick="handleTipClick('${data.Title}', '${data.Description}', '${data.Type}', '${data.Level}', '${data.UserName}', '${data.UserEmail}')">
                        <h1 id="Health-hub-tip-title-display">${data.Title}</h1>
                        <h2 id="Health-hub-tip-description-display">${data.Description}</h2>
                        <div class="Health-hub-tip-details">
                            <button id="Health-hub-tip-type-display">${data.Type}</button>
                            <button id="Health-hub-tip-level-btn-display">${data.Level}</button>
                        </div>
                        <h3 id="Health-hub-tip-username-display">${data.UserName}</h3>
                    </div>
                `;

                gridContainer.insertAdjacentHTML("beforeend", item);
            });
            idDisplaying = true;
        } catch (error) {
            console.error("Error fetching user's tips:", error);
            alert("Failed to fetch your tips. Please try again.");
        }   
    }else{
         RenderTips();
         idDisplaying = false;
    }
}
async function searchTipsByUsername() {
    console.log("working");
    const searchQuery = searchBar.value.toLowerCase(); // Get the search input and convert to lowercase
    const ref = collection(db, "HealthTipList");

    try {
        const snapshot = await getDocs(ref);
        const filteredTips = snapshot.docs.filter((doc) => {
            const data = doc.data();
            return data.UserName.toLowerCase().includes(searchQuery);
        });

        // Clear the grid before displaying the filtered tips
        gridContainer.innerHTML = "";

        if (filteredTips.length === 0) {
            gridContainer.innerHTML = "<p>No tips found matching the username.</p>";
            return;
        }

        // Render the filtered tips
        filteredTips.forEach((doc) => {
            const data = doc.data();
            const item = `
                <div 
                    class="Health-hub-tip" 
                    onclick="handleTipClick('${data.Title}', '${data.Description}', '${data.Type}', '${data.Level}', '${data.UserName}', '${data.UserEmail}')">
                    <h1 id="Health-hub-tip-title-display">${data.Title}</h1>
                    <h2 id="Health-hub-tip-description-display">${data.Description}</h2>
                    <div class="Health-hub-tip-details">
                        <button id="Health-hub-tip-type-display">${data.Type}</button>
                        <button id="Health-hub-tip-level-btn-display">${data.Level}</button>
                    </div>
                    <h3 id="Health-hub-tip-username-display">${data.UserName}</h3>
                </div>
            `;

            gridContainer.insertAdjacentHTML("beforeend", item);
        });
    } catch (error) {
        console.error("Error searching tips:", error);
        alert("Failed to search tips. Please try again.");
    }
}
// Function to Render Tips Sorted by Type
async function filterTipsByType() {
    const ref = collection(db, "HealthTipList");

    try {
        const snapshot = await getDocs(ref);

        // Sort the tips by Type (alphabetical order)
        const sortedTips = snapshot.docs.sort((a, b) => {
            const typeA = a.data().Type.toLowerCase();
            const typeB = b.data().Type.toLowerCase();
            return typeA.localeCompare(typeB);
        });

        // Clear the grid before rendering sorted tips
        gridContainer.innerHTML = "";

        // Render the sorted tips
        sortedTips.forEach((doc) => {
            const data = doc.data();
            const item = `
                <div 
                    class="Health-hub-tip" 
                    onclick="handleTipClick('${data.Title}', '${data.Description}', '${data.Type}', '${data.Level}', '${data.UserName}', '${data.UserEmail}')">
                    <h1 id="Health-hub-tip-title-display">${data.Title}</h1>
                    <h2 id="Health-hub-tip-description-display">${data.Description}</h2>
                    <div class="Health-hub-tip-details">
                        <button id="Health-hub-tip-type-display">${data.Type}</button>
                        <button id="Health-hub-tip-level-btn-display">${data.Level}</button>
                    </div>
                    <h3 id="Health-hub-tip-username-display">${data.UserName}</h3>
                </div>
            `;
            gridContainer.insertAdjacentHTML("beforeend", item);
        });
    } catch (error) {
        console.error("Error filtering tips by type:", error);
        alert("Failed to filter tips by type. Please try again.");
    }
}
// Function to Render Tips Sorted by Level
async function filterTipsByLevel() {
    const ref = collection(db, "HealthTipList");

    try {
        const snapshot = await getDocs(ref);

        // Define the custom order for Level
        const levelOrder = ["Begginer", "Easy", "Expert", "Professional"];
        const sortedTips = snapshot.docs.sort((a, b) => {
            const levelA = levelOrder.indexOf(a.data().Level);
            const levelB = levelOrder.indexOf(b.data().Level);
            return levelA - levelB;
        });

        // Clear the grid before rendering sorted tips
        gridContainer.innerHTML = "";

        // Render the sorted tips
        sortedTips.forEach((doc) => {
            const data = doc.data();
            const item = `
                <div 
                    class="Health-hub-tip" 
                    onclick="handleTipClick('${data.Title}', '${data.Description}', '${data.Type}', '${data.Level}', '${data.UserName}', '${data.UserEmail}')">
                    <h1 id="Health-hub-tip-title-display">${data.Title}</h1>
                    <h2 id="Health-hub-tip-description-display">${data.Description}</h2>
                    <div class="Health-hub-tip-details">
                        <button id="Health-hub-tip-type-display">${data.Type}</button>
                        <button id="Health-hub-tip-level-btn-display">${data.Level}</button>
                    </div>
                    <h3 id="Health-hub-tip-username-display">${data.UserName}</h3>
                </div>
            `;
            gridContainer.insertAdjacentHTML("beforeend", item);
        });
    } catch (error) {
        console.error("Error filtering tips by level:", error);
        alert("Failed to filter tips by level. Please try again.");
    }
}
// Function to Handle `onclick` Event
window.handleTipClick = function (title, description, type, level, userName, userEmail) {
    // Update the expanded container with the tip details
    document.getElementById("Health-hub-tip-title-display-expanded").textContent = title;
    document.getElementById("Health-hub-tip-description-display-expanded").textContent = description;
    document.getElementById("Health-hub-tip-type-display-expanded").textContent = type;
    document.getElementById("Health-hub-tip-level-btn-display-expanded").textContent = level;
    document.getElementById("Health-hub-tip-username-display-expanded").textContent = userName;

    // Show the expanded container and hide the grid view
    expandedContainer.style.display = "flex";
    gridContainer.style.display = "none";
};

// Function to Handle the Close Button Click
closeBtn.addEventListener("click", () => {
    // Hide the expanded container and show the grid view
    expandedContainer.style.display = "none";
    gridContainer.style.display = "";
    // RenderTips();
});
// Event Listener for Adding a Tip
submitbtn.addEventListener("click", AddHealthtip_AutoID);
deleteMyTipsBtn.addEventListener("click", deleteAllUserTips);
viewMyTipsBtn.addEventListener("click", viewMyTips);
searchBar.addEventListener("input", searchTipsByUsername);
filterByTypeBtn.addEventListener("click", filterTipsByType);
filterByLevelBtn.addEventListener("click", filterTipsByLevel);
// Initial Render
RenderTips();
