import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyACcvo2h4qLgkKdo7-ngWEf_BsDHcu9Uz4",
  authDomain: "multimedia-cog-trece-db.firebaseapp.com",
  projectId: "multimedia-cog-trece-db",
  storageBucket: "multimedia-cog-trece-db.firebasestorage.app",
  messagingSenderId: "590911223632",
  appId: "1:590911223632:web:ca01a50270d9565c6ade55"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to handle the submit (Saving to Firebase)
window.submitToRole = async function() {
    const slotId = document.getElementById("activeSlotId").value; 
    const userName = document.getElementById("nameInput").value;

    if (!userName) {
        alert("Please enter your name.");
        return;
    }

    try {
        const slotRef = doc(db, "slots", slotId);
        // Use setDoc with { merge: true } so you don't delete other data in the document
        await setDoc(slotRef, {
            name: userName,
            status: "taken"
        }, { merge: true });
        
        alert("Success! Slot updated.");
        document.getElementById("overlay").style.display = "none";
    } catch (e) {
        console.error("Error writing document: ", e);
        alert("Failed to update.");
    }
};

// Function to automatically update the UI when someone else books a slot
function listenForUpdates() {
    // This listens to all slots in real-time
    onSnapshot(collection(db, "slots"), (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            const slotId = doc.id;
            const pill = document.getElementById(`status-${slotId}`);
            if (pill && data.status === "taken") {
                pill.innerText = data.name; // Show the name instead of "Open"
                pill.classList.remove("available");
                pill.classList.add("taken");
            }
        });
    });
}

// Inside script.js
window.openModal = function(slotId, roleName) {
    document.getElementById("overlay").style.display = "flex"; // or "block"
    document.getElementById("selectedRole").innerText = roleName;
    document.getElementById("activeSlotId").value = slotId;
};

window.showSchedule = function(date) {
    document.getElementById("scheduleList").style.display = "none";
    document.getElementById("scheduleSection").classList.remove("hidden");
    document.getElementById("selectedDate").innerText = date;
};

window.backToList = function() {
    document.getElementById("scheduleList").style.display = "block";
    document.getElementById("scheduleSection").classList.add("hidden");
};

listenForUpdates();
