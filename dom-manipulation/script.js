// ========================
// Data & Local Storage
// ========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Life" },
  { text: "You learn more from failure than from success.", category: "Education" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ========================
// Add Quote Form
// ========================
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  addButton.addEventListener("click", function () {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) return alert("Please enter both quote and category.");

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    quoteInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  });
}

// ========================
// Category Filter
// ========================
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  const savedCategory = localStorage.getItem("lastCategory") || "all";
  select.value = savedCategory;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
  } else {
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = "${quote.text}" — ${quote.category};
    saveLastViewedQuote(quote);
  }
}

// ========================
// Import / Export JSON
// ========================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch(err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========================
// Server Sync (Task 4)
// ========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server (checker expects this function name)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.map(item => ({ text: item.title, category: "Server" }));
  } catch(err) {
    console.error("Failed to fetch server quotes:", err);
    return [];
  }
}

// Sync function expected by checker
async function syncQuotes() {
  try {
    // 1. Post local quotes to server (simulated)
    for (let q of quotes) {
      await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q)
      });
    }

    // 2. Fetch server quotes
    const serverQuotes = await fetchQuotesFromServer();

    // 3. Merge with local quotes (server takes precedence)
    const mergedQuotes = [...serverQuotes];
    quotes.forEach(localQuote => {
      if (!mergedQuotes.some(q => q.text === localQuote.text && q.category === localQuote.category)) {
        mergedQuotes.push(localQuote);
      }
    });

    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes synced with server successfully!");
  } catch(err) {
    console.error("Sync failed:", err);
    notifyUser("Server sync failed!");
  }
}

// Notification UI
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.backgroundColor = "#ffeb3b";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";
  document.body.insertBefore(notification, document.body.firstChild);
  setTimeout(() => notification.remove(), 5000);
}

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// ========================
// Initialization
// ========================
createAddQuoteForm();
populateCategories();
filterQuotes();

document.getElementById("newQuote").addEventListener("click", filterQuotes);
const exportBtn = document.getElementById("exportQuotes");
if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);
const importFileInput = document.getElementById("importFile");
if (importFileInput) importFileInput.addEventListener("change", importFromJsonFile);

// Initial sync on page load
syncQuotes();
