document.getElementById("removeBtn").addEventListener("click", () => {
  const elementId = document.getElementById("elementId").value;
  if (elementId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: (id) => {
            const element = document.getElementById(id);
            if (element) {
              element.remove();
            }
          },
          args: [elementId],
        },
        () => {
          chrome.runtime.sendMessage(
            { action: "addElement", id: elementId },
            (response) => {
              document.getElementById("status").textContent = response.status;
            }
          );
        }
      );
    });
  }
});
