var menteeData = JSON.parse(sessionStorage.getItem("menteeData"));
var menteeColorType = menteeData.colorType;
console.log(menteeColorType)
// Example data. This will be deleted when this is linked to a database
// const mentors = [
//     { id: 'mentor1', colorType: 'red' },
//     { id: 'mentor2', colorType: 'blue' },
//     { id: 'mentor3', colorType: 'green' },
//     { id: 'mentor4', colorType: 'blue' }
// ];

document.addEventListener("DOMContentLoaded", function() {
    const listmentee = document.getElementById("listmentee");

    listmentee.addEventListener("click", function() {
        fetchMentorData().then(mentors => {
            displayMatchResults(mentors);
        }).catch(error => {
            console.error('Error fetching mentor data:', error);
            displayMatchResults(["Error fetching mentor data."]);
        });
    });
});

function fetchMentorData() {
    return fetch('/getMentorDetails')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching mentor data:', error));
}

function displayMatchResults(mentors) {
    const resultDisplay = document.getElementById("mentorMatchResult");

    resultDisplay.style.color = "black";
    resultDisplay.innerHTML = ''; // Clear the previous content

    if (mentors.length === 0) {
        resultDisplay.textContent = "No suitable mentors found.";
    } else {
        resultDisplay.innerHTML = "Matched Mentors:<br>";
        mentors.forEach(mentor => {
            resultDisplay.innerHTML += `<div>Username: ${mentor.userName} (${mentor.userEmail}) with colorType: ${mentor.colorType}</div>`;
        });
    }
}

