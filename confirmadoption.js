import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4l9MAjo0nwg8svNH2nCe1amzsRnu11Lk",
  authDomain: "adopet-9b45a.firebaseapp.com",
  databaseURL: "https://adopet-9b45a-default-rtdb.firebaseio.com",
  projectId: "adopet-9b45a",
  storageBucket: "adopet-9b45a.appspot.com",
  messagingSenderId: "528567839616",
  appId: "1:528567839616:web:def598f1423ef83ab6f65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Helper to get input values
const getElementVal = (id) => document.getElementById(id).value.trim();

// Handle Form Submission
document.getElementById("adoptConfirmationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if user is logged in
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to submit the adoption confirmation. Redirecting to login page...");
    window.location.href = "login.html"; // Replace with the path to your login page
    return;
  }

  const petName = getElementVal("petName");
  const petBreed = getElementVal("petBreed");
  const petAge = getElementVal("petAge");
  const petDescription = getElementVal("petDescription");
  const buyerName = getElementVal("buyerName");
  const buyerEmail = getElementVal("buyerEmail");
  const buyerPhone = getElementVal("buyerPhone");
  const adopterAddress = getElementVal("adopterAddress");
  const adoptionDate = getElementVal("adoptionDate");
  const petExperience = getElementVal("petexperience");

  // Validation to ensure no empty fields are submitted
  if (
    petName === "" ||
    petBreed === "" ||
    petAge === "" ||
    petDescription === "" ||
    buyerName === "" ||
    buyerEmail === "" ||
    buyerPhone === "" ||
    adopterAddress === "" ||
    adoptionDate === "" ||
    petExperience === ""
  ) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  const confirmAdoptRef = ref(database, "confirmadopt");
  const newAdoptRef = push(confirmAdoptRef);

  set(newAdoptRef, {
    petName,
    petBreed,
    petAge,
    petDescription,
    buyerName,
    buyerEmail,
    buyerPhone,
    adopterAddress,
    adoptionDate,
    petExperience,
    userId: user.uid, // Save the user ID for reference
    userEmail: user.email, // Save the user's email for reference
  })
    .then(() => {
      alert("Adoption confirmation submitted successfully!");
      document.getElementById("adoptConfirmationForm").reset();
      window.location.href = "./project/index.html";

    })
    .catch((error) => {
      console.error("Error submitting adoption confirmation:", error);
      alert("Failed to submit the form. Please try again.");
    });
});

// Monitor authentication state and update UI
onAuthStateChanged(auth, (user) => {
  const submitButton = document.querySelector('button[type="submit"]');
  if (user) {
    // User is logged in
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    loadConfirmedPosts(user.email);  // Fetch confirmed posts when logged in
  } else {
    // User is not logged in
    submitButton.disabled = true;
    submitButton.textContent = "Log in to Submit";
    alert("Please log in to continue.");
  }
});

// Function to fetch and display confirmed adoption posts
function loadConfirmedPosts(userEmail) {
  const confirmedPostsData = document.getElementById('confirmedPostsData');
  const confirmAdoptRef = ref(database, "confirmadopt");

  // Fetch posts from the database
  onValue(confirmAdoptRef, (snapshot) => {
    confirmedPostsData.innerHTML = ""; // Clear previous data
    let dataFound = false; // Variable to track if data is found

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();

      // Only show posts for the logged-in user
      if (data.userEmail === userEmail) {
        dataFound = true; // Found a post for the user
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.petName}</td>
          <td>${data.petBreed}</td>
          <td>${data.petAge}</td>
          <td>${data.petDescription}</td>
          <td>${data.adopterAddress}</td>
          <td>${data.adoptionDate}</td>
          <td>${data.buyerName}</td>
          <td>${data.buyerPhone}</td>
        `;
        confirmedPostsData.appendChild(row);
      }
    });

    // If no data is found for the user
    if (!dataFound) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="8">No confirmed adoption posts found.</td>`;
      confirmedPostsData.appendChild(row);
    }

  }, (error) => {
    console.error("Error fetching confirmed adoption posts:", error);
  });
}

// Function to fetch pet data when pet is clicked
function loadPetData(petId) {
  const petRef = ref(database, "pets/" + petId); // Assuming pets are stored under "pets" node with unique IDs
  onValue(petRef, (snapshot) => {
    const petData = snapshot.val();
    if (petData) {
      document.getElementById("petName").value = petData.name;
      document.getElementById("petBreed").value = petData.breed;
      document.getElementById("petAge").value = petData.age;
      document.getElementById("petDescription").value = petData.description;
    }
  }, (error) => {
    console.error("Error fetching pet data:", error);
  });
}

// Example: Use the loadPetData function when a pet is clicked
// You can modify this code to call loadPetData with the correct pet ID
document.querySelectorAll(".pet-item").forEach((petItem) => {
  petItem.addEventListener("click", () => {
    const petId = petItem.getAttribute("data-pet-id"); // Assuming you store pet ID in a data attribute
    loadPetData(petId);
  });
});
