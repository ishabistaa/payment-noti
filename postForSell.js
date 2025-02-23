// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPVUYFGvtRBrq59GaAYkj5_U2O-hSpUPc",
  authDomain: "adoptpet-a601b.firebaseapp.com",
  databaseURL: "https://adoptpet-a601b-default-rtdb.firebaseio.com",
  projectId: "adoptpet-a601b",
  storageBucket: "adoptpet-a601b.appspot.com",
  messagingSenderId: "96785941976",
  appId: "1:96785941976:web:b33e3c8ebd4a9a17669ead",
  measurementId: "G-TQE9G5KL5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// References to DOM elements
const petForm = document.getElementById("petForm");

// Handle the form submission
const postPetForSale = (e) => {
  e.preventDefault();

  // Get the form data
  const photo = document.getElementById("photo")?.files[0]?.name || "No photo uploaded";
  const name = document.getElementById("name").value.trim();
  const breed = document.getElementById("breed").value.trim();
  const age = parseFloat(document.getElementById("age").value.trim());
  const sex = document.getElementById("sex").value;
  const weight = parseFloat(document.getElementById("weight").value.trim());
  const vaccinations = document.getElementById("vaccinations").value.trim();
  const lastVaccinationDate = document.getElementById("lastVaccinationDate").value.trim();
  const vetDocs = document.getElementById("vetDocs").files;
  const description = document.getElementById("description").value.trim();
  const price = parseFloat(document.getElementById("price").value.trim());
  const contact = document.getElementById("contact").value.trim();
  const status = "available"; // Added status field

  // Validate age, weight, and price to ensure they are non-negative
  if (isNaN(age) || age < 0) {
    alert("Age must be a positive number.");
    return;
  }

  if (isNaN(weight) || weight < 0) {
    alert("Weight must be a positive number.");
    return;
  }

  if (isNaN(price) || price < 0) {
    alert("Price must be a positive number.");
    return;
  }

  // Validate last vaccination date to ensure it's not in the future
  const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
  if (lastVaccinationDate && lastVaccinationDate > currentDate) {
    alert("Vaccination date cannot be in the future.");
    return;
  }

  // Validate contact number to ensure it is exactly 10 digits
  const phonePattern = /^[0-9]{10}$/; // Regex for exactly 10 digits
  if (!contact.match(phonePattern)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  // Prepare pet data (No login required)
  const petData = {
    petName: name,
    breed: breed,
    age: age,
    sex: sex,
    weight: weight,
    vaccinations: vaccinations,
    lastVaccinationDate: lastVaccinationDate,
    vetDocs: Array.from(vetDocs).map((file) => file.name), // File names for vet docs
    description: description,
    price: `Rs ${price.toLocaleString()}`, // Display price in rupees (Rs)
    contact: contact,
    photo: photo, // You would handle photo uploads separately (firebase storage)
    status: status // Added status field
  };

  // Push data to Firebase
  const petRef = ref(database, "petsForSale/");
  push(petRef, petData)
    .then(() => {
      alert("Pet posted successfully for sale!");
      window.location.href = "./sellpets.html"; // Redirect to user profile page
    })
    .catch((error) => {
      alert("Failed to post pet. Try again.");
      console.error(error);
    });
};

// Add event listener for form submission
petForm.addEventListener("submit", postPetForSale);
