document.addEventListener("DOMContentLoaded", function () {
    const accountForm = document.getElementById("assignedGroup");
    
    accountForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const colorType = document.getElementById('assignedGroup').value;

        // Create a JSON object with the user input data
        const userData = {
          colorType
        };
        console.log(userData)
        // Send the data to the server for insertion
      sendDataToServer(userData);
    });

    async function sendDataToServer(userData) { //sends data to submit form to send survey data
        fetch("/submit_form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response here
            if (data.success) {
                alert("Thank you for responding to the survey!");
                window.location.href = 'Mentee.html';
            } else {
                alert("An error occurred: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
            window.location.href = 'loginpage.html';
        });
        }
});


