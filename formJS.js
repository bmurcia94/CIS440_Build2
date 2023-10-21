
// const connection = require('./database_connection')
// const app = require('./app')

// var userName;
// var userPass;
// var userEmail;
// var userFirst;
// var userLast;
// var userCompany;

// function createAccount() {
//     alert('createAccount function called');

//     userName    = document.getElementById("userNameID").value;
//     userPass    = document.getElementById("userPassID").value;
//     userEmail   = document.getElementById("userEmailID").value;
//     userFirst   = document.getElementById("userFirstID").value;
//     userLast    = document.getElementById("userLastID").value; 
//     userCompany = document.getElementById("userCompanyID").value;

//     connection.connect()

//     app.post('/createAccount', (req, res) => {
//         const userName = req.body.userName;
//         const userPass = req.body.userPass;
//         const userEmail = req.body.userEmail;
//         const userFirst = req.body.userFirst;
//         const userLast = req.body.userLast;
//         const userCompany = req.body.userCompany;

//     const userData = {
//         userName:    userName,
//         userPass:    userPass,
//         userEmail:   userEmail,
//         firstName:   userFirst,
//         lastName:    userLast,
//         userCompany: userCompany,
//     }

//     const values = [
//         userData.userName,
//         userData.userPass,
//         userData.userEmail,
//         userData.userFirst,
//         userData.userLast,
//         userData.userCompany,
//     ]

//     const sql = 'INSERT INTO User (userName, userPass, userEmail, userFirst, userLast, userCompany) VALUES (?, ?, ?, ?, ?, ?)';

//     connection.query(sql, values, (err, results) => {
//         if (err) {
//           console.error('Error inserting data:', err);
//           return;
//         }
//         console.log('Data inserted successfully');

//         connection.end();
//       });
// });
// }

// function clearForm(form) {
// 	var formElements = form.elements;
// 	for (var i=0; i< formElements.length; i++)
// 		formElements[i].value="";
// }

document.addEventListener("DOMContentLoaded", function () {
    const accountForm = document.getElementById("createAccount");

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
        console.log(userdata)
        // Send the data to the server for insertion
      sendDataToServer(userData);
    });

    async function sendDataToServer(userData) {
        fetch("/create_account", {
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
                window.location.href = 'index.html';
            } else {
                // alert("An error occurred: " + data.message);
                // alert("Account created successfully!");
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // alert("An error occurred. Please try again.");
            window.location.href = 'index.html';
        });
        }
    
});