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
    var mentorlist = [];

    resultDisplay.style.color = "black";
    resultDisplay.innerHTML = ''; // Clear the previous content

    if (mentors.length === 0) {
        resultDisplay.textContent = "No suitable mentors found.";
    } else {
        resultDisplay.innerHTML = "Matched Mentors:<br>";
        mentors.forEach(mentor => {
          
          var newRow = tableBody.insertRow(tableBody.rows.length);
          var cell1 = newRow.insertCell(0);
          var cell2 = newRow.insertCell(1);

          cell1.innerHTML = row.userName;
          cell2.innerHTML = '<button class="typeButton">select</button>';
          
            //resultDisplay.innerHTML += `<div>Username: ${mentor.userName} (${mentor.userEmail})</div>`;
            //mentorlist.push({ "Name": mentor.userName, "Email": mentor.userEmail});
        });
        console.log(mentorlist);

