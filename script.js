import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

window.submitToRole = async function() {
    const slotId = document.getElementById("activeSlotId").value;
    const userName = document.getElementById("nameInput").value;
if (!userName) { alert("Invalid"); return; }
    const slotRef = doc(db, "slots", slotId);

    try {
        
        const docSnap = await getDoc(slotRef);
        
        if (docSnap.exists() && docSnap.data().status === "taken") {
            alert("Sorry! Someone else just got this slot.");
            document.getElementById("overlay").style.display = "none";
            return;
        }
        await setDoc(slotRef, {
            name: userName,
            status: "taken"
        }, { merge: true });

        alert("Success! Slot secured.");
        document.getElementById("overlay").style.display = "none";
    } catch (e) {
        console.error(e);
        alert("Failed to update.");
        document.getElementById("overlay").style.display = "none";
    }
};

function listenForUpdates() {
    onSnapshot(collection(db, "slots"), (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            const slotId = doc.id;
            const pill = document.getElementById(`status-${slotId}`);
            if (pill && data.status === "taken") {
                pill.innerText = data.name;
                pill.classList.remove("available");
                pill.classList.add("taken");
            }
        });
    });
}
function loadScheduleData(datePrefix) {
    const q = query(
        collection(db, "slots"), 
        where("__name__", ">=", datePrefix),
        where("__name__", "<=", datePrefix + "\uf8ff")
    );

    onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            const pill = document.getElementById(`status-${doc.id}`);
            if (pill) {
                pill.innerText = data.name || "Open";
        
                if(data.status === "taken") {
                    pill.classList.add("taken");
                    pill.classList.remove("available");
                }
            }
        });
    });
}

window.openModal = function(slotId, roleName) {
    document.getElementById("overlay").style.display = "flex"; // or "block"
    document.getElementById("selectedRole").innerText = roleName;
    document.getElementById("activeSlotId").value = slotId;
};

window.showSchedule = function(dateLabel, dateId) {
    document.getElementById("scheduleList").style.display = "none";
    document.getElementById("scheduleSection").classList.remove("hidden");
    document.getElementById("selectedDate").innerText = dateLabel;

    renderSlots(dateId);

    loadScheduleData(dateId);
};
window.renderSlots = function(dateId) {
    const container = document.getElementById("slotContainer");
    container.innerHTML = ""; 
  
    const scheduleData = [
        { title: "Morning Schedule", time: "AM" },
        { title: "Afternoon Schedule", time: "PM" }
    ];
    const roles = ["LED", "Preaching Support", "Prompter"];

    scheduleData.forEach(shift => {
        
        let listDiv = document.createElement("div");
        listDiv.className = "slot-list";
        listDiv.innerHTML = `<h3>${shift.title}</h3>`;

        roles.forEach(role => {
            const roleKey = role.replace(/\s+/g, '-').toUpperCase();
            const slotId = `${dateId}-${shift.time}-${roleKey}`;
          
            listDiv.innerHTML += `
                <div class="slot-row" onclick="openModal('${slotId}', '${role}')">
                    <div class="role-wrap">
                        <span class="role-name">${role}</span>
                        <span class="role-sub">${shift.time} Schedule</span>
                    </div>
                    <span class="status-pill available" id="status-${slotId}">Open</span>
                </div>
            `;
        });
        container.appendChild(listDiv);
    });
};

window.backToList = function() {
    document.getElementById("scheduleList").style.display = "block";
    document.getElementById("scheduleSection").classList.add("hidden");
};

