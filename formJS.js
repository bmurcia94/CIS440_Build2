document.addEventListener("DOMContentLoaded", function () {
    const accountForm = document.getElementById("createAccountForm");

    accountForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const userName    = document.getElementById("userNameID").value;
        const userPass    = document.getElementById("userPassID").value;
        const userEmail   = document.getElementById("userEmailID").value;
        const userFirst   = document.getElementById("userFirstID").value;
        const userLast    = document.getElementById("userLastID").value; 
        const userCompany = document.getElementById("userCompanyID").value;

        // Create a JSON object with the user input data
        const userData = {
            userName,
            userPass,
            userEmail,
            userFirst,
            userLast,
            userCompany
        };
        console.log(userData)
        // Send the data to the server for insertion
      sendDataToServer(userData);
    });

    async function sendDataToServer(userData) {
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
                alert("Account created successfully!");
                window.location.href = 'loginpage.html';
            } else {
                // alert("An error occurred: " + data.message);
                // alert("Account created successfully!");
                window.location.href = 'create_account.html';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
            window.location.href = 'loginpage.html';
        });
        }
});
