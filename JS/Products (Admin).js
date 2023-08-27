const dateText = document.getElementById("date")
// Create a new Date object
const currentDate = new Date();

// Get the year, month, and day from the Date object
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based
const day = currentDate.getDate();

// Format the date as needed (e.g., "MM/DD/YY" or "YYYY-MM-DD")
const formattedDate = `${month}/${day}/${year}`;

dateText.textContent = formattedDate