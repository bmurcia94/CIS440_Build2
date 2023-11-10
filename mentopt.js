document.addEventListener("DOMContentLoaded", function() {
    const findMentorButton = document.getElementById("listmentee");

    fetchMentorData().then(mentors => {
        displayMatchResults(mentors);
    }).catch(error => {
        console.error('Error fetching mentor data:', error);
        displayMatchResults(["Error fetching mentor data."]);
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
            cell2.textContent = mentor.userID;

            const selectButton = document.createElement("button");
            selectButton.className = "typeButton";
            selectButton.textContent = "Request Mentor";


            console.log("menteeID: ", JSON.parse(sessionStorage.getItem("menteeData")).menteeID)
            selectButton.addEventListener("click", function() {
                const selectedID = mentor.mentorID; 
                fetch('/addMentorToMentee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        mentorID: selectedID,
                        menteeID: JSON.parse(sessionStorage.getItem("menteeData")).menteeID
                    }),
                })
                .then(response => {
                    if (response.ok) {
                        // Handle a successful response, such as showing a success message.
                        console.log('Mentor selected and added to the database.');
                    } else {
                        // Handle errors, if any.
                        console.error('Failed to add the mentor to the database.');
                    }
                });
            });
            buttonCell.appendChild(selectButton);

        });
        resultDisplay.appendChild(table);
    }
}
