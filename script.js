document.getElementById('btnLogin').addEventListener('click', function () {
    window.location.href = 'loginpage.html';
});

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

function userLogin() {
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
                window.location.href = 'Mentee.html';
            } else if (checkUser.userType === 'Mentor') {
                window.location.href = 'Mentor.html';
            } else {
                alert("Unknown user type. Please contact support.");
            }
        } else {
            alert("Your credentials did not match. Try again");
        }
    });
}

