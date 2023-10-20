"use strict";

var userName;
var userPass;
var userEmail;
var firstName;
var lastName;
var userCompany;

function createAccount() {
    userName    = document.getElementById("userNameID");
    userPass    = document.getElementById("userPassID");
    userEmail   = document.getElementById("userEmailID");
    firstName   = document.getElementById("firstNameID");
    lastName    = document.getElementById("lastNameID"); 
    userCompany = document.getElementById("userCompanyID");

    


}

function clearForm(form) {
	var formElements = form.elements;
	for (var i=0; i< formElements.length; i++)
		formElements[i].value="";
}