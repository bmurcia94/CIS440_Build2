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
        resultDisplay.innerHTML = "<hr><br><div class='mentees-header'>Your Mentees:</div><br>";

        const table = document.createElement("table");

        const headerRow = table.insertRow();
        const header1 = headerRow.insertCell(0);
        const header2 = headerRow.insertCell(1);
        const header3 = headerRow.insertCell(2);
   
        header1.textContent = "First Name";
        header2.textContent = "Last Name";
        header3.textContent = "Email";
       
        mentee.forEach(mentee => {
            // resultDisplay.innerHTML += `<div>Name: ${mentee.userFirst} ${mentee.userLast} - Email: ${mentee.userEmail}</div>`;
            // menteelist.push({ "First": mentee.userFirst, "Last": mentee.userLast, "Email": mentee.userEmail});

            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = mentee.userFirst;
            cell2.textContent = mentee.userLast;
            cell3.textContent = mentee.userEmail;
             
        });
        //console.log(menteelist);
        resultDisplay.appendChild(table);
    }
}
