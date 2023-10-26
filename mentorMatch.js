// Example data. This will be deleted when this is linked to a database
const mentee = { id: 'mentee1', colorType: 'blue' };
const mentors = [
    { id: 'mentor1', colorType: 'red' },
    { id: 'mentor2', colorType: 'blue' },
    { id: 'mentor3', colorType: 'green' },
    { id: 'mentor4', colorType: 'blue' }
];

document.addEventListener("DOMContentLoaded", function() {
    const findMentorButton = document.getElementById("findMentorButton");

    findMentorButton.addEventListener("click", function() {
        const match = findRandomMentorForMentee(mentee, mentors);
        displayMatchResult(match);
    });
});

function findRandomMentorForMentee(mentee, mentors) {
    const matchingMentors = mentors.filter(mentor => mentor.colorType === mentee.colorType);

    if (matchingMentors.length === 0) {
        return "No suitable mentor found.";
    }

    const randomIndex = Math.floor(Math.random() * matchingMentors.length);
    return matchingMentors[randomIndex];
}

function displayMatchResult(match) {
    const resultDisplay = document.getElementById("mentorMatchResult"); 
    
    resultDisplay.style.color = "black";

    if (typeof match === 'string') {
        resultDisplay.textContent = match;
    } else {
        resultDisplay.textContent = `Matched Mentor: ${match.id} with colorType: ${match.colorType}`;
    }
}

