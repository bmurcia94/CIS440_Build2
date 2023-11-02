var menteeData = JSON.parse(sessionStorage.getItem("menteeData"));
var menteeColorType = menteeData.colorType;

document.addEventListener("DOMContentLoaded", function() {
    const random = document.getElementById("random");

    random.addEventListener("click", function() {
        fetchMentorData().then(mentors => {
            const matches = findMentorsForMentee(menteeColorType, mentors, 10);
            displayMatchResults(matches);
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

function findMentorsForMentee(menteeColorType, mentors, count) {
    const matchingMentors = mentors.filter(mentor => mentor.colorType === menteeColorType);

    if (matchingMentors.length === 0) {
        return ["No suitable mentor found."];
    }

    const randomIndexes = getRandomIndexes(matchingMentors, count);
    const matches = randomIndexes.map(index => matchingMentors[index]);
    return matches;
}

function getRandomIndexes(array, count) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count).map((_, index) => array.indexOf(shuffled[index]));
}

function displayMatchResults(matches) {
    const resultDisplay = document.getElementById("mentorMatchResult");

    resultDisplay.style.color = "black";

    if (matches.length === 0) {
        resultDisplay.textContent = "No suitable mentors found.";
    } else {
        resultDisplay.innerHTML = "Matched Mentors:<br>";
        matches.forEach(match => {
            resultDisplay.innerHTML += `<div>Username: ${match.userName} (${match.userEmail}) with colorType: ${match.colorType}</div>`;
        });
    }
}
