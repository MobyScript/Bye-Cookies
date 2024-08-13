document.addEventListener("DOMContentLoaded", populateHistory);

// Function to load and display removed elements
function populateHistory() {
  chrome.storage.sync.get("elements", (data) => {
    const elements = data.elements || [];
    const itemsList = document.getElementById("items-list");
    itemsList.innerHTML = "";

    if (elements.length === 0) {
      itemsList.innerHTML = "<p>No items have been removed.</p>";
    } else {
      const ul = document.createElement("ul");

      console.log(data);
      elements.forEach((id, index) => {
        const li = document.createElement("li");
        li.textContent = `Element ID: ${id}`;

        const undoButton = document.createElement("button");
        undoButton.textContent = "Undo";
        undoButton.onclick = () => undoRemoval(index, id);

        li.appendChild(undoButton);
        ul.appendChild(li);
      });

      itemsList.appendChild(ul);
    }
  });
}

// Function to undo the removal of an element
function undoRemoval(index, id) {
  chrome.storage.sync.get("elements", (data) => {
    const elements = data.elements || [];
    elements.splice(index, 1); // Remove the element from the list
    chrome.storage.sync.set({ elements: elements }, () => {
      populateHistory(); // Refresh the history list
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "undoElement", id: id },
        (response) => {
          console.log(response.status);
        }
      );
    });
  });
}
