document.getElementById("removeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => {
        let hasDivBeenRemoved = false; // Flag to track if a div has been removed

        const divs = document.getElementsByTagName("div");
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.border = "0.5px solid red";
          divs[i].addEventListener("click", (e) => {
            if (!hasDivBeenRemoved) {
              const removedDivId = divs[i].id; // Get the ID of the removed div
              divs[i].remove();
              hasDivBeenRemoved = true; // Set flag to true after a div is removed

              // Save the removed div ID to chrome.storage.sync
              chrome.storage.sync.get({ elements: [] }, (result) => {
                const updatedElements = [...result.elements, removedDivId];
                chrome.storage.sync.set({ elements: updatedElements }, () => {
                  console.log("Removed div ID saved:", removedDivId);
                });
              });

              // Reset the borders of remaining divs
              for (let j = 0; j < divs.length; j++) {
                divs[j].style.border = "";
              }
              e.stopImmediatePropagation(); // Stop event propagation
            }
          });
        }
      },
    });
  });
});

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

document.getElementById("go-to-history").addEventListener("click", () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("history.html"),
  });
});
