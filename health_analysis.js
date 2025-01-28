// Function to add a new patient's details
function addPatient() {
  const name = document.getElementById("name").value; // Get the name value
  const gender = document.querySelector('input[name="gender"]:checked'); // Get selected gender
  const age = document.getElementById("age").value; // Get the age value
  const condition = document.getElementById("condition").value; // Get the selected condition

  // Validate input fields
  if (name && gender && age && condition) {
    // Add the new patient to the array
    patients.push({ name, gender: gender.value, age, condition });

    // Reset the form for the next entry
    resetForm();

    // Update the report based on the new data
    generateReport();
  } else {
    // Alert user if any field is missing
    alert("Please fill out all fields before adding a patient.");
  }
}

// Function to reset the form fields
function resetForm() {
  document.getElementById("name").value = ""; // Clear the name field
  const selectedGender = document.querySelector('input[name="gender"]:checked'); // Get selected gender
  if (selectedGender) {
    selectedGender.checked = false; // Uncheck the selected radio button
  }
  document.getElementById("age").value = ""; // Clear the age field
  document.getElementById("condition").value = ""; // Reset the condition dropdown
}

function searchCondition() {
  const input = document.getElementById("conditionInput").value.toLowerCase(); // Get user input
  const resultDiv = document.getElementById("result"); // Get the result container
  resultDiv.innerHTML = ""; // Clear any existing content

  // Fetch data from the health_analysis.json file
  fetch("health_analysis.json")
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // Search for the condition matching the user input
      const condition = data.conditions.find(
        (item) => item.name.toLowerCase() === input
      );

      if (condition) {
        // Format and display the condition details
        const symptoms = condition.symptoms.join(", ");
        const prevention = condition.prevention.join(", ");
        const treatment = condition.treatment;

        resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
        resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="${condition.name}" style="max-width: 200px; display: block; margin-bottom: 10px;">`;
        resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
        resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
        resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
      } else {
        // Display an error message if the condition isn't found
        resultDiv.innerHTML = "Condition not found.";
      }
    })
    .catch((error) => {
      // Handle any errors during the fetch process
      console.error("Error:", error);
      resultDiv.innerHTML = "An error occurred while fetching data.";
    });
}

// Add an event listener to the search button
btnSearch.addEventListener("click", searchCondition);

// Function to generate and display the analysis report
function generateReport() {
  const numPatients = patients.length; // Total number of patients

  // Initialize condition counts
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };

  // Initialize gender-based condition counts
  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  // Process the patients array to update counts
  for (const patient of patients) {
    conditionsCount[patient.condition]++; // Increment condition count
    genderConditionsCount[patient.gender][patient.condition]++; // Increment gender-based condition count
  }

  // Build the report content
  report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
  report.innerHTML += `Conditions Breakdown:<br>`;
  for (const condition in conditionsCount) {
    report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
  }
  report.innerHTML += `<br>Gender-Based Conditions:<br>`;
  for (const gender in genderConditionsCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const condition in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
    }
  }
}

// Event listener for the Add Patient button
addPatientButton.addEventListener("click", addPatient);
