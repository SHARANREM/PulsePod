import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { writeBatch, getFirestore, doc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

// Button and input elements
const createTaskBtn = document.getElementById("task-m-create-task-btn");
const titleInput = document.getElementById("task-m-title-input");
const priorityInput = document.getElementById("task-m-priority-input");
const descriptionInput = document.getElementById("task-m-description-input");
const tagInput = document.getElementById("task-m-tag-input");
const dateInput = document.getElementById("task-m-date-input");
const statusInput = document.getElementById("task-m-status-input");


// User's email from sessionStorage
const userEmail = JSON.parse(sessionStorage.getItem("user-creds"))?.email || "unknown_user@example.com";

createTaskBtn.addEventListener("click", async () => {
    // Get input values
    const title = titleInput.value.trim();
    const priority = priorityInput.value;
    const description = descriptionInput.value.trim();
    const tag = tagInput.value;
    const date = dateInput.value;
    const status = statusInput.value;

    // Task object
    const task = {
        title,
        priority,
        description,
        tag,
        date,
        status,
        createdAt: new Date().toISOString(), // Timestamp
    };

    try {
        // Add task to Firestore
        const userTasksCollection = collection(db, `users/${userEmail}/tasks`);
        const docRef = await addDoc(userTasksCollection, task);

        // UI feedback
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "lime";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1500);
        document.querySelector(".task-manager-task-add-slide").style.display = "none";

        // Reload tasks
        loadTasks();
        updateTaskStatusMarks();
        // Clear the form
        titleInput.value = "";
        priorityInput.value = "Priority";
        descriptionInput.value = "";
        tagInput.value = "Tag";
        dateInput.value = "";
        statusInput.value = "Status";
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add the task. Please try again.");
    }
});
async function loadTasks() {
    try {
        // Fetch tasks from Firestore
        const tasksRef = collection(db, `users/${userEmail}/tasks`);
        const taskSnapshot = await getDocs(tasksRef);

        // Select the grid container and expanded view container
        const taskGridContainer = document.querySelector(".task-manager-container-task-grid.t-m-item-cont");
        const expandedViewContainer = document.querySelector(".task-manager-task-expanded-view");
        const closeBtn = expandedViewContainer.querySelector("#task-expand-close-btn");

        if (!taskGridContainer || !expandedViewContainer || !closeBtn) {
            console.error("Required containers or elements not found.");
            return;
        }

        // Add click event to close button to toggle views
        closeBtn.addEventListener("click", () => {
            expandedViewContainer.style.display = "none";
            taskGridContainer.style.display = "grid";
        });

        // Clear existing tasks in the grid container
        taskGridContainer.innerHTML = "";

        // Loop through tasks and add them to the grid container
        taskSnapshot.forEach(doc => {
            const task = doc.data();
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-manager-container-task-item");

            // Define background color classes or inline styles for tag, priority, and status
            const tagBgColor = getTagBgColor(task.tag);
            const priorityBgColor = getPriorityBgColor(task.priority);
            const statusBgColor = getStatusBgColor(task.status);

            // Set task item's inner HTML
            taskItem.innerHTML = `
                <h3 id="item-title">${task.title}</h3>
                <div class="task-manager-container-task-item-details" data-task-id="${doc.id}">
                    <h5 id="item-tag" style="background-color: ${tagBgColor}; color: white;">${task.tag}</h5>
                    <h5 id="item-priority" style="background-color: ${priorityBgColor}; color: white;">${task.priority}</h5>
                    <h5 id="item-date">${task.date}</h5>
                    <h5 id="item-status" style="background-color: ${statusBgColor}; color: white;">${task.status}</h5>
                </div>
            `;

            // Add an onclick event to the task item
            taskItem.onclick = () => expandTaskView(task,doc.id);

            // Append task item to the grid container
            taskGridContainer.appendChild(taskItem);
        });

        if (taskSnapshot.empty) {
            taskGridContainer.innerHTML = "<p>No tasks found. Start by adding a new task!</p>";
        }

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}
// Function to expand the task view
function expandTaskView(task,ids) {
    // Select the grid container and expanded view container
    const taskGridContainer = document.querySelector(".task-manager-container-task-grid.t-m-item-cont");
    const expandedViewContainer = document.querySelector(".task-manager-task-expanded-view");

    if (!taskGridContainer || !expandedViewContainer) {
        console.error("Required containers not found.");
        return;
    }

    // Update expanded view with task details
    expandedViewContainer.querySelector("#expanded-title").textContent = task.title;
    expandedViewContainer.querySelector("#expanded-description").textContent = task.description || "No description available.";

    const tagElement = expandedViewContainer.querySelector("#item-tag");
    const priorityElement = expandedViewContainer.querySelector("#item-priority");
    const statusElement = expandedViewContainer.querySelector("#item-status");
    const dateElement = expandedViewContainer.querySelector("#item-date"); // Add this line
    const idElement = expandedViewContainer.querySelector("#itsid");

    tagElement.textContent = task.tag;
    priorityElement.textContent = task.priority;
    statusElement.textContent = task.status;
    dateElement.textContent = task.date; // Set the date content
    idElement.textContent = ids;
    

    // Set background colors dynamically
    tagElement.style.backgroundColor = getTagBgColor(task.tag);
    priorityElement.style.backgroundColor = getPriorityBgColor(task.priority);
    statusElement.style.backgroundColor = getStatusBgColor(task.status);

    // Show the expanded view and hide the task grid
    expandedViewContainer.style.display = "block";
    taskGridContainer.style.display = "none";

    // Populate the input fields in the edit slide with the task data
    document.getElementById("task-m-title-input-edit").value = task.title;
    document.getElementById("task-m-description-input-edit").value = task.description;
    document.getElementById("this-things-id").textContent = ids;
    // Set the tag and priority inputs
    document.getElementById("task-m-tag-input-edit").value = task.tag;
    document.getElementById("task-m-priority-input-edit").value = task.priority;
    document.getElementById("task-m-status-input-edit").value =task.status;

    // Set the date input (format it if necessary)
    document.getElementById("task-m-date-input-edit").value = task.date;
}
// Call loadTasks when the page loads
window.addEventListener("load", loadTasks);

//cosmetics
function getTagBgColor(tag) {
    switch (tag) {
        case "Personal": return "#4f8ab8";  // Soft blue
        case "Office": return "#7bbf7b";    // Soft green
        case "Friends": return "#f79c42";   // Soft orange
        case "Learning": return "#9b66cc";  // Soft purple
        case "Gaming": return "#58a9c4";    // Soft teal
        case "Health": return "#ff6f61";    // Soft red
        default: return "#d3d3d3";          // Soft gray
    }
}

function getPriorityBgColor(priority) {
    switch (priority) {
        case "Low": return "#64d164";    // Soft green
        case "Medium": return "#f1b824"; // Soft yellow
        case "High": return "#f24e4e";   // Soft red
        case "Extreme": return "#d03030"; // Darker red
        default: return "#d3d3d3";       // Soft gray
    }
}

function getStatusBgColor(status) {
    switch (status) {
        case "Done": return "#67f367";  // Soft green
        case "Not-Done": return "#ff5c5c"; // Soft red
        case "In-Progress": return "#f2a600"; // Soft orange
        case "Abandoned": return "#a5a5a5"; // Soft gray
        case "Hold": return "#63b8f0";  // Soft blue
        case "Has-Doubts": return "#9e61f2"; // Soft purple
        default: return "#d3d3d3";       // Soft gray
    }
}

// Grab elements for editing
const editTaskBtn = document.getElementById("task-m-create-task-btn-ok");
const titleInputEdit = document.getElementById("task-m-title-input-edit");
const priorityInputEdit = document.getElementById("task-m-priority-input-edit");
const descriptionInputEdit = document.getElementById("task-m-description-input-edit");
const tagInputEdit = document.getElementById("task-m-tag-input-edit");
const dateInputEdit = document.getElementById("task-m-date-input-edit");
const statusInputEdit = document.getElementById("task-m-status-input-edit");
const thasId = document.getElementById("itsid");

// Variables to hold the task to edit
let editingTaskId = null; // Store the task ID to update it in Firestore

// Event listener to save the edited task
editTaskBtn.addEventListener("click", async () => {
    const title = titleInputEdit.value.trim();
    const priority = priorityInputEdit.value;
    const description = descriptionInputEdit.value.trim();
    const tag = tagInputEdit.value;
    const date = dateInputEdit.value;
    const status = statusInputEdit.value;

    // Update task object
    const updatedTask = {
        title,
        priority,
        description,
        tag,
        date,
        status,
        updatedAt: new Date().toISOString(), // Timestamp for when the task was updated
    };

    try {
        // Update task in Firestore under user email -> tasks -> specific taskId
        const taskRef = doc(db, `users/${userEmail}/tasks/${editingTaskId}`);
        await updateDoc(taskRef, updatedTask);

        // Notify user of successful update
        alert("Task updated successfully!");

        // Hide the edit form
        document.querySelector(".task-manager-task-edit-slide").style.display = "none";

        // Reload tasks
        loadTasks();
        updateTaskStatusMarks();
    } catch (error) {
       
    }
});

const editTasksubmit = document.getElementById("task-m-create-task-btn-ok");

editTasksubmit.addEventListener("click",()=>{
    const edittitle = document.getElementById("task-m-title-input-edit");
    const editpriot = document.getElementById("task-m-priority-input-edit");
    const editdesc = document.getElementById("task-m-description-input-edit");
})

document.getElementById("task-m-create-task-btn-ok").addEventListener("click", async () => {
    // Retrieve the task ID and user information
    const taskId = document.getElementById("this-things-id").textContent.trim();
    const usersEmail = userEmail;

    if (!taskId || !usersEmail) {
        alert("Failed to identify the task or user. Please try again.");
        return;
    }

    // Get the updated task details from the form
    const updatedTitle = document.getElementById("task-m-title-input-edit").value.trim();
    const updatedPriority = document.getElementById("task-m-priority-input-edit").value;
    const updatedDescription = document.getElementById("task-m-description-input-edit").value.trim();
    const updatedTag = document.getElementById("task-m-tag-input-edit").value;
    const updatedDate = document.getElementById("task-m-date-input-edit").value;
    const updatedStatus = document.getElementById("task-m-status-input-edit").value;

    // Task object with updated values
    const updatedTask = {
        title: updatedTitle,
        priority: updatedPriority,
        description: updatedDescription,
        tag: updatedTag,
        date: updatedDate,
        status: updatedStatus,
        updatedAt: new Date().toISOString(), // Add an updated timestamp
    };

    try {
        // Reference to the specific task document in Firestore
        const taskRef = doc(db, `users/${userEmail}/tasks`, taskId);
        await updateDoc(taskRef, updatedTask);

        // Provide feedback to the user
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "lime";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1500);

        // Hide the edit form and reload tasks
        document.querySelector(".task-manager-task-edit-slide").style.display = "none";
        const taskedit_slide = document.querySelector(".task-manager-task-expanded-view");
        const taskGridContainer = document.querySelector(".task-manager-container-task-grid.t-m-item-cont");
        taskGridContainer.style.display = "grid";
        taskedit_slide.style.display = "none";
        loadTasks();
        updateTaskStatusMarks();
    } catch (error) {
        console.error("Error updating task: ", error);
        alert("Failed to update the task. Please try again.");
    }
});

document.getElementById("task-delete-btn").addEventListener("click", async () => {
    // Retrieve the task ID and user information
    const taskId = document.getElementById("itsid").textContent.trim();
    const usersEmail = userEmail;

    if (!taskId || !usersEmail) {
        alert("Failed to identify the task or user. Please try again.");
        return;
    }

    // Confirm deletion
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
        // Reference to the specific task document in Firestore
        const taskRef = doc(db, `users/${userEmail}/tasks`, taskId);
        await deleteDoc(taskRef);

        // Provide feedback to the user
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "lime";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1500);

        // Hide the expanded view and reload tasks
        document.querySelector(".task-manager-task-expanded-view").style.display = "none";
        document.querySelector(".task-manager-container-task-grid.t-m-item-cont").style.display = "grid";
        loadTasks();
        updateTaskStatusMarks();
    } catch (error) {
        console.error("Error deleting task: ", error);
        alert("Failed to delete the task. Please try again.");
    }
});


const taskSearchBar = document.getElementById("task-search-bar"); // Reference to the search bar
const taskGridContainer = document.querySelector(".task-manager-container-task-grid.t-m-item-cont"); // The container where tasks are displayed

// Function to search tasks by query (search bar input)
async function searchTasksByQuery() {
    const searchQuery = taskSearchBar.value.trim().toLowerCase(); // Get the search input and convert to lowercase
    const userEmails = userEmail; // Replace with actual user email dynamically
    const userTasksCollection = collection(db, `users/${userEmails}/tasks`); // Reference to the user's tasks collection

    try {
        const snapshot = await getDocs(userTasksCollection); // Fetch documents from the collection
        const filteredTasks = snapshot.docs.filter((doc) => {
            const data = doc.data();
            return (
                data.title.toLowerCase().includes(searchQuery)
            );
        });

        // Clear the grid before displaying the filtered tasks
        taskGridContainer.innerHTML = "";

        if (filteredTasks.length === 0) {
            taskGridContainer.innerHTML = "<p>No tasks found matching the search query.</p>";
            return;
        }

        // Loop through filtered tasks and add them to the grid container
        filteredTasks.forEach((doc) => {
            const data = doc.data();
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-manager-container-task-item");

            // Define background color classes for tag, priority, and status
            const tagBgColor = getTagBgColor(data.tag); // Function to get tag background color
            const priorityBgColor = getPriorityBgColor(data.priority); // Function to get priority background color
            const statusBgColor = getStatusBgColor(data.status); // Function to get status background color

            // Set task item's inner HTML (use the same structure as in loadTasks)
            taskItem.innerHTML = `
                <h3 id="item-title">${data.title}</h3>
                <div class="task-manager-container-task-item-details" data-task-id="${doc.id}">
                    <h5 id="item-tag" style="background-color: ${tagBgColor}; color: white;">${data.tag}</h5>
                    <h5 id="item-priority" style="background-color: ${priorityBgColor}; color: white;">${data.priority}</h5>
                    <h5 id="item-date">${data.date}</h5>
                    <h5 id="item-status" style="background-color: ${statusBgColor}; color: white;">${data.status}</h5>
                </div>
            `;

            // Add an onclick event to the task item
            taskItem.onclick = () => expandTaskView(data, doc.id);

            // Append task item to the grid container
            taskGridContainer.appendChild(taskItem);
        });

    } catch (error) {
        console.error("Error searching tasks:", error);
        alert("Failed to search tasks. Please try again.");
    }
}

// Add event listener to the search bar for real-time searching
taskSearchBar.addEventListener("input", searchTasksByQuery);

document.getElementById("task-delete-completed-tasks").addEventListener("click", async () => {
    const usserEmail = userEmail;  // Current user's email
    if (!usserEmail) {
        alert("Failed to identify the user. Please try again.");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete Completed task?");
    if (!confirmDelete) return;

    try {
        // Reference to the user's tasks collection
        const userTasksCollection = collection(db, `users/${userEmail}/tasks`);

        // Query to get all tasks
        const tasksSnapshot = await getDocs(userTasksCollection);

        if (tasksSnapshot.empty) {
            alert("No tasks found.");
            return;
        }

        // Create a batch to perform deletions
        const batch = writeBatch(db);

        // Loop through tasks and check their status
        tasksSnapshot.forEach((doc) => {
            const taskData = doc.data();

            // If the task's status is "done", add it to the batch for deletion
            if (taskData.status === "Done") {
                batch.delete(doc.ref);
            }
        });

        // Commit the batch delete
        await batch.commit();

        console.log("All completed tasks have been deleted.");

        // UI feedback: Show a temporary success message
        const target = document.querySelector(".home-navigation");
        target.style.backgroundColor = "red";
        setTimeout(() => {
            target.style.backgroundColor = "";
        }, 1500);

        // Reload tasks after deletion
        loadTasks(); // Make sure the task list is updated after deletion
        updateTaskStatusMarks();

    } catch (error) {
        console.error("Error deleting completed tasks:", error);
        alert("Failed to delete completed tasks. Please try again.");
    }
});

async function updateTaskStatusMarks() {
    const userEmails = userEmail;  // Current user's email
    if (!userEmails) {
        alert("Failed to identify the user. Please try again.");
        return;
    }

    try {
        // Reference to the user's tasks collection
        const userTasksCollection = collection(db, `users/${userEmails}/tasks`);

        // Query to get all tasks
        const tasksSnapshot = await getDocs(userTasksCollection);

        if (tasksSnapshot.empty) {
            document.getElementById("task-status-marks").innerHTML = "Done: <span>0/0</span>";
            return;
        }

        // Initialize counters
        let totalTasks = 0;
        let doneTasks = 0;

        // Loop through tasks and check their status
        tasksSnapshot.forEach((doc) => {
            const taskData = doc.data();

            totalTasks++;  // Increment total tasks count

            // If the task's status is "Done", increment done tasks count
            if (taskData.status === "Done") {
                doneTasks++;
            }
        });

        // Update the task status marks element
        const taskStatusElement = document.getElementById("task-status-marks");
        taskStatusElement.innerHTML = `Done: <span>${doneTasks}/${totalTasks}</span>`;

    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to update task status. Please try again.");
    }
}

updateTaskStatusMarks();



// Add event listener for the sorting dropdown
document.getElementById("task-filter-btn").addEventListener("change", async (event) => {
    const selectedOption = event.target.value; // Get the selected sorting option
    const userTasksCollection = collection(db, `users/${userEmail}/tasks`);

    try {
        // Fetch all tasks
        const snapshot = await getDocs(userTasksCollection);
        if (snapshot.empty) {
            taskGridContainer.innerHTML = "<p>No tasks available for sorting.</p>";
            return;
        }

        // Convert Firestore documents into an array
        const tasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort tasks based on the selected option
        let sortedTasks;
        switch (selectedOption) {
            case "Date":
                sortedTasks = tasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
                break;
            case "Status":
                sortedTasks = tasks.sort((a, b) => a.status.localeCompare(b.status)); // Sort by status
                break;
            case "Priority":
                sortedTasks = tasks.sort((a, b) => a.priority.localeCompare(b.priority)); // Sort by priority
                break;
            case "Tags":
                sortedTasks = tasks.sort((a, b) => a.tag.localeCompare(b.tag)); // Sort by tags
                break;
            default:
                sortedTasks = tasks;
                break;
        }

        // Clear the task grid container
        taskGridContainer.innerHTML = "";

        // Re-render the sorted tasks
        sortedTasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-manager-container-task-item");

            
            const tagBgColor = getTagBgColor(task.tag);
            const priorityBgColor = getPriorityBgColor(task.priority);
            const statusBgColor = getStatusBgColor(task.status); 

            // Populate task HTML
            taskItem.innerHTML = `
                <h3 id="item-title">${task.title}</h3>
                <div class="task-manager-container-task-item-details" data-task-id="${task.id}">
                    <h5 id="item-tag" style="background-color: ${tagBgColor}; color: white;">${task.tag}</h5>
                    <h5 id="item-priority" style="background-color: ${priorityBgColor}; color: white;">${task.priority}</h5>
                    <h5 id="item-date">${task.date}</h5>
                    <h5 id="item-status" style="background-color: ${statusBgColor}; color: white;">${task.status}</h5>
                </div>
            `;

            // Add an onclick event to the task item
            taskItem.onclick = () => expandTaskView(task, task.id);

            // Append task item to the grid container
            taskGridContainer.appendChild(taskItem);
        });
    } catch (error) {
        console.error("Error sorting tasks:", error);
        alert("Failed to sort tasks. Please try again.");
    }
});
