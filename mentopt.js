document.addEventListener("DOMContentLoaded", function() {
    const findMentorButton = document.getElementById("listmentee");
    const jsonData = [
            { "Name": "Patricia Watson"},
            { "Name": "Ben Birdland"},
            { "Name": "Parasoul Renoir"},
            { "Name": "Marie Korbel"}
        ];


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
        mentors.forEach(mentor => {
            mentorlist.push({ "Name": mentor.userName, "Email": mentor.userEmail});
        });
        // can be removed later
        console.log(mentorlist);
        
        // Reference to the table body
        var tableBody = document.querySelector("#data-table tbody");

        // Loop through the JSON data and populate the table
        mentorlist.forEach(function (row) {
            var newRow = tableBody.insertRow(tableBody.rows.length);
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);

            cell1.innerHTML = row.Name;
            cell2.innerHTML = '<button class="typeButton">select</button>';
        });
    }
}
*/
