/* document.getElementById('btnLogin').addEventListener('click', function () {
    window.location.href = 'loginpage.html';
}); */


function userLogin() {
    console.log("User login function called");
    var userName = document.getElementById('username').value;
    var userPass = document.getElementById('password').value;
    var user;

    $.get("?tableName=User", function (userTable) {
        user = JSON.parse(userTable);

        var checkUser = user.find(function (user) {
            return user.userName === userName && user.userPass === userPass;
        });

        if (checkUser) {
            sessionStorage.setItem("isLoggedIn", true);
            alert("Login successful!");

            // Check the userType and redirect accordingly
            if (checkUser.userType === 'Mentee') {
                console.log("Redirecting to Mentee.html");
                window.location.href = 'Mentee.html';
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

/*
function checkLoginState() {
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        var loginButton = document.getElementById('btnLogin');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    }
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
window.addEventListener('load', checkLoginState);
window.addEventListener('load', checkLogoutState);
*/

