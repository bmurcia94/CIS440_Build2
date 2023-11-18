/* document.getElementById('btnLogin').addEventListener('click', function () {
    window.location.href = 'loginpage.html';
}); */
function fetchMenteeData(userName) { //code used to get mentee data
    return fetch(`/getMenteeData?userName=${encodeURIComponent(userName)}`)
        .then(response => response.json())
        .then(data => {
            return data[0]; // Assuming the query returns a single row
        })
        .catch(error => console.error('Error fetching mentee data:', error));
}

function userLogin() { //code used for user to login based on entered values in the form
    console.log("User login function called");
    var userName = document.getElementById('username').value;
    var userPass = document.getElementById('password').value;
    var user;

    $.get("?tableName=User", function (userTable) {
        console.log("Raw user table data:", JSON.stringify(userTable)); // Add this line to log the raw response
        
        // Try to parse only if it's a string
        if (typeof userTable === 'string') {
            user = JSON.parse(userTable);
        } else {
            user = userTable; // If it's already an object, use it directly
        }
        var checkUser = user.find(function (user) {
            return user.userName === userName && user.userPass === userPass;
        });
        console.log("Matching user:", JSON.stringify(checkUser));

        if (checkUser) {
            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("currentUserID", checkUser.userID);
            
            
            
            alert("Login successful!");

            // Check the userType and redirect accordingly
            if (checkUser.userType === 'Mentee') {
                fetchMenteeData(userName).then(menteeData => {
                    // Store mentee data in sessionStorage or handle it as needed
                    sessionStorage.setItem("menteeData", JSON.stringify(menteeData));
                    console.log("Redirecting to Mentee.html");
                    window.location.href = 'Mentee.html';
                });
            } else if (checkUser.userType === 'Mentor') {
                console.log("Redirecting to Mentor.html");
                window.location.href = 'Mentor.html';
            } else {
                console.log("Did not work");
                alert("Unknown user type. Please contact support.");
            }
        } else {
            console.log("Did not work");
            alert("Your credentials did not match. Try again");
        }
    });
}

function checkLoginState() { //code used to check if the user is logged in
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        var loginButton = document.getElementById('btnLogin');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    }
}

function userLogout() { //code used to logout a user 
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("menteeData");
    window.location.href = 'index.html'; 
}

function checkLogoutState() { //checks if a user has logged out
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        var logoutButton = document.getElementById('btnLogout');
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
    }
}
document.getElementById('btnLogout').addEventListener('click', userLogout);

window.addEventListener('load', checkLoginState);
window.addEventListener('load', checkLogoutState);


