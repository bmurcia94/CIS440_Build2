document.addEventListener("DOMContentLoaded", function() {
    const listMenteeButton = document.getElementById("myMentees");
    

    listMenteeButton.addEventListener("click", function() {
        fetchMenteesData().then(mentee => {
            displayMatchResults(mentee);
        }).catch(error => {
            console.error('Error fetching mentee data:', error);
            displayMatchResults(["Error fetching mentee data."]);
        });
    });
});

async function fetchMenteesData() {
    return fetch('/getMenteeList')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching mentee data:', error));
}

function displayMatchResults(mentee) {
    const resultDisplay = document.getElementById("displayMentees");
    var menteelist = [];

    resultDisplay.style.color = "black";
    resultDisplay.innerHTML = ''; // Clear the previous content
    console.log(mentee)
    console.log(menteelist)

    if (mentee.length === 0) {
        resultDisplay.textContent = "You have no mentees.";
    } else {
        resultDisplay.innerHTML = "<hr>Your Mentees:<br>";
        mentee.forEach(mentee => {
            resultDisplay.innerHTML += `<div>Name: ${mentee.userFirst} ${mentee.userLast} - Email: ${mentee.userEmail}</div>`;
            menteelist.push({ "First": mentee.userFirst, "Last": mentee.userLast, "Email": mentee.userEmail});
        });
        //console.log(menteelist);
    }
}
