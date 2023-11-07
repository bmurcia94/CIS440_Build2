document.addEventListener("DOMContentLoaded", function () {
    const accountForm = document.getElementById("ratingForm");

    accountForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const userName    = document.getElementById("userNameID").value;
        const userRating   = document.getElementById("ratingID").value;
 
        // Create a JSON object with the user input data
        const userData = {
            userName,
            userRating  
        };
        console.log(userData)
        // Send the data to the server for insertion
      sendDataToServer(userData);
    });

    async function sendDataToServer(userData) {
        fetch("/rating_form", {
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
                alert("Your Rating has been added!");
                window.location.href = 'Mentee.html';
            } else {
                alert("An error occurred: " + data.message);
                alert("Your rating could not be added!");
                window.location.href = 'Mentee.html';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Your Rating has been added");
            window.location.href = 'Mentee.html';
        });
        }
});