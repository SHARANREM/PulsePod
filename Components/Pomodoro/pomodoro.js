// Main Elements
var playBtn = document.getElementById("play-pause-btn");
var MusicBtn = document.getElementById("pomodoro-music-btn");
var SettingBtn = document.getElementById("pomodoro-settings");

var playIcon = playBtn.querySelector("img"); 
var PomodoroClass = document.querySelector(".pomodoro-container-out");
var SettingsClass = document.querySelector(".pomodoro-container-settings-tab");
var MusicClass = document.querySelector(".pomodoro-container-music-tab");

var MusicCloseBtn = document.getElementById("pomodoro-container-music-tab-close");
var settingsCloseBtn = document.getElementById("pomodoro-container-settings-tab-close");

const workTimeInput = document.getElementById("pomodoro-work-min-time");
const restTimeInput = document.getElementById("pomodoro-rest-min-time");

var workTime = 1500; // Default: 25 minutes
var restTime = 300; // Default: 5 minutes
var isInWork = true;
var countdown;

const timerDisplay = document.getElementById("pomodoro-time");
const presentWorkLabel = document.getElementById("present-work");

let remainingTime = workTime; 
let isTimerRunning = false;
let currentAudio = null;

// Update time values on clicking the Update button
document.getElementById("pomodoro-update-time").addEventListener("click", () => {
    workTime = parseInt(workTimeInput.value) * 60 || 1500; 
    restTime = parseInt(restTimeInput.value) * 60 || 300;   
    remainingTime = isInWork ? workTime : restTime;
    updateDisplay();
    SettingsClass.style.display = "none";
    PomodoroClass.style.display = "flex";
});

// Start the timer
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        countdown = setInterval(() => {
            remainingTime--;
            updateDisplay();
            if (remainingTime <= 0) {
                switchSession();
            }
        }, 1000); 
    }
}

// Pause the timer
function pauseTimer() {
    isTimerRunning = false;
    clearInterval(countdown);
}

// Reset the timer
function resetTimer() {
    pauseTimer();
    remainingTime = isInWork ? workTime : restTime;
    updateDisplay();
}

// Update the timer display
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Switch between work and rest sessions
function switchSession() {
    isInWork = !isInWork;
    remainingTime = isInWork ? workTime : restTime;
    presentWorkLabel.textContent = isInWork ? "Work" : "Rest";
    updateDisplay();
}

// Initialize on load
window.addEventListener('load', () => {
    checkedCred(); 
    resetTimer(); 
});

// Play/Pause button functionality
playBtn.addEventListener("click", () => {
    if (isTimerRunning) {
        pauseTimer();
        playIcon.src = "/assets/play-button-arrowhead (1).png";
    } else {
        startTimer();
        playIcon.src = "/assets/pause (1).png";
    }
});

// Music display
MusicBtn.addEventListener("click", () => {
    MusicClass.style.display = "flex";
    PomodoroClass.style.display = "none";
});
MusicCloseBtn.addEventListener("click", () => {
    MusicClass.style.display = "none";
    PomodoroClass.style.display = "flex";
});

// Settings display
SettingBtn.addEventListener("click", () => {
    SettingsClass.style.display = "flex";
    PomodoroClass.style.display = "none";
});
settingsCloseBtn.addEventListener("click", () => {
    SettingsClass.style.display = "none";
    PomodoroClass.style.display = "flex";
});
function playMusic(audioId) {
    // Stop currently playing audio, if any
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset time
    }

    // Set and play the selected audio
    currentAudio = document.getElementById(audioId);
    currentAudio.loop = true; // Loop the audio indefinitely
    currentAudio.play();
}

// Add event listeners to play buttons
document.getElementById("Play-None").addEventListener("click", () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
});

document.getElementById("Play-brown-noise").addEventListener("click", () => playMusic("Music1"));
document.getElementById("Play-white-noise").addEventListener("click", () => playMusic("Music2"));
document.getElementById("Play-pink-noise").addEventListener("click", () => playMusic("Music3"));
document.getElementById("Play-rain-noise").addEventListener("click", () => playMusic("Music4"));
document.getElementById("Play-birds-noise").addEventListener("click", () => playMusic("Music5"));

// Listen for keydown events on the whole document
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault(); 
        if (isTimerRunning) {
            pauseTimer();
            playIcon.src = "/assets/play-button-arrowhead (1).png";
        } else {
            startTimer();
            playIcon.src = "/assets/pause (1).png";
        }
    }
    
    if (event.key === "m" || event.key === "M") {
        if (MusicClass.style.display === "flex") {
            MusicClass.style.display = "none";
            PomodoroClass.style.display = "flex";
        } else {
            MusicClass.style.display = "flex";
            PomodoroClass.style.display = "none";
        }
    }
    
    if (event.key === "s" || event.key === "S") {
        if (SettingsClass.style.display === "flex") {
            SettingsClass.style.display = "none";
            PomodoroClass.style.display = "flex";
        } else {
            SettingsClass.style.display = "flex";
            PomodoroClass.style.display = "none";
        }
    }
});