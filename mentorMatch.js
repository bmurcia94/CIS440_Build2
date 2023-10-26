function findRandomMentorForMentee(mentee, mentors) {
    // Filter mentors who match the mentee's colorType
    const matchingMentors = mentors.filter(mentor => mentor.colorType === mentee.colorType);

    // If no matching mentors, return a message
    if (matchingMentors.length === 0) {
        return "No suitable mentor found.";
    }

    // Select a random mentor from the matching mentors
    const randomIndex = Math.floor(Math.random() * matchingMentors.length);
    return matchingMentors[randomIndex];
}

// Example usage:
const mentee = { id: 'mentee1', colorType: 'blue' };
const mentors = [
    { id: 'mentor1', colorType: 'red' },
    { id: 'mentor2', colorType: 'blue' },
    { id: 'mentor3', colorType: 'green' },
    { id: 'mentor4', colorType: 'blue' }
];

const randomMatch = findRandomMentorForMentee(mentee, mentors);
console.log(randomMatch);
