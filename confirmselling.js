import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4l9MAjo0nwg8svNH2nCe1amzsRnu11Lk",
    authDomain: "adopet-9b45a.firebaseapp.com",
    projectId: "adopet-9b45a",
    storageBucket: "adopet-9b45a.appspot.com",
    messagingSenderId: "528567839616",
    appId: "1:528567839616:web:def598f1423ef83ab6f65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Auto-fill pet details from localStorage
window.onload = () => {
    const petData = JSON.parse(localStorage.getItem("selectedPet"));
    if (petData) {
        document.getElementById("petName").value = petData.petName;
        document.getElementById("petBreed").value = petData.breed;
        document.getElementById("petAge").value = petData.age + " years";
    }
};

// Handle form submission
document.getElementById("buyConfirmationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to submit the buy confirmation. Redirecting to login page...");
        window.location.href = "login.html"; // Replace with your login page
        return;
    }

    const formData = {
        petName: document.getElementById("petName").value,
        petBreed: document.getElementById("petBreed").value,
        petAge: document.getElementById("petAge").value,
        buyerName: document.getElementById("buyerName").value,
        buyerEmail: document.getElementById("buyerEmail").value,
        buyerPhone: document.getElementById("buyerPhone").value,
        reason: document.getElementById("reason").value,
        buyAgreement: document.getElementById("buyAgreement").checked,
        purchaseDate: new Date().toLocaleDateString(),
    };

    // Reference to 'confirmselling' in the Firebase Realtime Database
    const confirmsellingRef = ref(database, 'confirmselling');
    const newConfirmationRef = push(confirmsellingRef);

    // Save the confirmation data to Firebase
    set(newConfirmationRef, {
        petName: formData.petName,
        petBreed: formData.petBreed,
        petAge: formData.petAge,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        reason: formData.reason,
        buyAgreement: formData.buyAgreement,
        purchaseDate: formData.purchaseDate,
        userId: user.uid, // Save the user ID to identify the buyer
    }).then(() => {
        alert("Your buy confirmation has been submitted!");
        window.location.href = "confirmationPage.html"; // Redirect to a confirmation page or elsewhere
    }).catch((error) => {
        console.error("Error saving the buy confirmation:", error);
        alert("Failed to submit your buy confirmation. Please try again.");
    });

    // Clear form (optional)
    document.getElementById("buyConfirmationForm").reset();

    // Remove selected pet data from localStorage
    localStorage.removeItem("selectedPet");
});

// Monitor authentication state and enable/disable submission
onAuthStateChanged(auth, (user) => {
    const submitButton = document.querySelector("button[type='submit']");
    if (user) {
        // User is logged in
        submitButton.disabled = false;
        submitButton.textContent = "Submit buy Confirmation";
    } else {
        // User is not logged in
        submitButton.disabled = true;
        submitButton.textContent = "Log in to Submit";
    }
});
