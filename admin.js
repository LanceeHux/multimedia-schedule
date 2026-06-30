import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

onSnapshot(collection(db, "slots"), (snapshot) => {
    const tableBody = document.getElementById("adminBody");
    tableBody.innerHTML = ""; // Clear existing

    // Inside your onSnapshot loop:
snapshot.forEach((doc) => {
    const data = doc.data();
    const [date, shift, role] = doc.id.split('-'); // Splits '0712-AM-LED'
    
    tableBody.innerHTML += `
        <tr>
            <td style="color:var(--text-muted)">${date}</td>
            <td style="font-weight:500">${shift}</td>
            <td>${role}</td>
            <td>${data.name || "—"}</td>
            <td><span class="status-pill ${data.status === 'taken' ? 'taken' : 'available'}">
                ${data.status || 'Open'}
            </span></td>
        </tr>
    `;
});
});
