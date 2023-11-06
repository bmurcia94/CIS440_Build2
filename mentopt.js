document.addEventListener("DOMContentLoaded", function() {
    const findMentorButton = document.getElementById("listmentee");
    

    findMentorButton.addEventListener("click", function() {
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
    const resultDisplay = document.getElementById("showlist");
    resultDisplay.style.color = "black";
    resultDisplay.innerHTML = ''; // Clear the previous content

    if (mentors.length === 0) {
        resultDisplay.textContent = "No suitable mentors found.";
    } else {
        resultDisplay.innerHTML = "Matched Mentors:<br>";
        const table = document.createElement("table");

        mentors.forEach(mentor => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const buttonCell = row.insertCell(2);

            cell1.textContent = mentor.userName;
            cell2.textContent = mentor.userEmail;

            const selectButton = document.createElement("button");
            selectButton.className = "typeButton";
            selectButton.textContent = "Select Mentor";
            buttonCell.appendChild(selectButton);
        });

        resultDisplay.appendChild(table);
    }
}

/* 
function displayMatchResults(mentors) {
    const resultDisplay = document.getElementById("showlist");
    var mentorlist = [];

    resultDisplay.style.color = "black";
    resultDisplay.innerHTML = ''; // Clear the previous content

    if (mentors.length === 0) {
        resultDisplay.textContent = "No suitable mentors found.";
    } else {
        resultDisplay.innerHTML = "Matched Mentors:<br>";
        mentors.forEach(mentor => {
            resultDisplay.innerHTML += `<div>Username: ${mentor.userName} (${mentor.userEmail}) with colorType: ${mentor.colorType}</div>`;
            mentorlist.push({ "Name": mentor.userName, "Email": mentor.userEmail});
        });
        console.log(mentorlist);
    }
}
*/
