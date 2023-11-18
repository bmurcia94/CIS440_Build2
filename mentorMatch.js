var menteeData = JSON.parse(sessionStorage.getItem("menteeData"));
var menteeColorType = menteeData.colorType;
console.log(menteeColorType)

document.addEventListener("DOMContentLoaded", function() {
    const findMentorButton = document.getElementById("findMentorButton");

    findMentorButton.addEventListener("click", function() {
        fetchMentorData().then(mentors => {
            const match = findRandomMentorForMentee(menteeColorType, mentors);
            displayMatchResult(match);
        }).catch(error => {
            console.error('Error fetching mentor data:', error);
            displayMatchResult("Error fetching mentor data.");
        });
    });
});

async function fetchMentorData() { //code that gets mentor data
    return fetch('/getMentorDetails')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching mentor data:', error));
}

function findRandomMentorForMentee(menteeColorType, mentors) { //code that will randomly assign a mentee with a mentor
    const matchingMentors = mentors.filter(mentor => mentor.colorType === menteeColorType);

    if (matchingMentors.length === 0) {
        return "No suitable mentor found.";
    }

    const randomIndex = Math.floor(Math.random() * matchingMentors.length);
    return matchingMentors[randomIndex];
}


function displayMatchResult(match) { //code that displays the results of random match
    const resultDisplay = document.getElementById("mentorMatchResult"); 
    
    resultDisplay.style.color = "black";
    resultDisplay.style.display = "block";

    if (typeof match === 'string') {
        resultDisplay.innerHTML = match;
    } else {
        resultDisplay.innerHTML = `Your mentor is <strong>${match.userName}</strong><br>Their email address is <a href="mailto:${match.userEmail}">${match.userEmail}</a>`;
    }
}
