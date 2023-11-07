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
