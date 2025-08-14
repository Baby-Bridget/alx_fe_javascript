// Array of quote objects
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Life" },
  { text: "You learn more from failure than from success.", category: "Education" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Add some!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = "${quote.text}" — ${quote.category};
}

// Function to dynamically create the Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");

  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create submit button
  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  // Append inputs and button to form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add event listener for adding quote
  addButton.addEventListener("click", function () {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both quote and category.");
      return;
    }

    // Add new quote to array
    quotes.push({ text, category });

    // Clear inputs
    quoteInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
  });
}

// Call createAddQuoteForm to render the form
createAddQuoteForm();

// Add event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
