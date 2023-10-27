
document.getElementById('btnLogin').addEventListener('click', function () {
    window.location.href = 'loginpage.html';
});

document.getElementById('btnLogout').addEventListener('click', function () {
    var logoutButton = document.getElementById('btnLogout');
    logoutButton.style.display = 'none';

    sessionStorage.clear();
    
    window.location.href = 'loginpage.html'; 
});

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

            var loginButton = document.getElementById('btnLogin');
            loginButton.style.display = 'none';

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

