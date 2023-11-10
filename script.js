/* document.getElementById('btnLogin').addEventListener('click', function () {
    window.location.href = 'loginpage.html';
}); */
function fetchMenteeData(userName) {
    return fetch(`/getMenteeData?userName=${encodeURIComponent(userName)}`)
        .then(response => response.json())
        .then(data => {
            return data[0]; // Assuming the query returns a single row
        })
        .catch(error => console.error('Error fetching mentee data:', error));
}

function userLogin() {
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
            console.log('a')
            sessionStorage.setItem("isLoggedIn", true);
            alert("Login successful!");

            // Check the userType and redirect accordingly
            if (checkUser.userType === 'Mentee') {
                console.log('b')
                fetchMenteeData(userName).then(menteeData => {
                    // Store mentee data in sessionStorage or handle it as needed
                    sessionStorage.setItem("menteeData", JSON.stringify(menteeData));
                    console.log("Redirecting to Mentee.html");
                    window.location.href = 'Mentee.html';
                });
                console.log('c')
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

function checkLoginState() {
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        var loginButton = document.getElementById('btnLogin');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    }
}

function userLogout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("menteeData");
    window.location.href = 'index.html'; 
}

function checkLogoutState() {
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


