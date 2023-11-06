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
            // Create a container div for each mentor
            const mentorContainer = document.createElement("div");
            mentorContainer.classList.add("mentor-container");

            // Display the mentor's information
            mentorContainer.innerHTML = `
                <div>Username: ${mentor.userName} (${mentor.userEmail})</div>
                <button class="select-button">Select</button>
                <hr>
            `;

            // Append the container to the resultDisplay
            resultDisplay.appendChild(mentorContainer);

            mentorlist.push({ "Name": mentor.userName, "Email": mentor.userEmail });
        });
    }
}
