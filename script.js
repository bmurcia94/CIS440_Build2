// Code to redirect to loginpage.html when the button is clicked
document.getElementById('btnLogin').addEventListener('click', function() {
    window.location.href = 'loginpage.html';
});

function userLogin() {
    var userName = document.getElementById('username').value; //grab values from username textbox
    var userPass = document.getElementById('password').value; //grab values from password textbox
    var user; //create variable that will hold table information


        $.get("?tableName=User", function (userTable) {     //JQuery GET method to request an array of information from database
            //console.log(userTable);
            user = JSON.parse(userTable);       //converts array data to JSON

            var checkUser = user.find(function (user) {         // variable that will use find method to search array for specific values
                return user.userName === userName && user.userPass === userPass;        //checks whether username and its corresponding password are the same 
            });

            if (checkUser) {
                sessionStorage.setItem("isLoggedIn", true);
                alert("Login successful!"); //if both are correlated, success message
                window.location.href = 'index.html'; // redirect to homepage after successful login
            }
            else {
                alert("Your credentials did not match. Try again"); //if both are not correlated, failed message
            }      
            }); //end if-else

} //end function
