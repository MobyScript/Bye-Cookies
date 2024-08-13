chrome.storage.sync.get("elements", (data) => {
  const elements = data.elements || [];
  elements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "hideElement") {
    const element = document.getElementById(request.id);
    if (element) {
      element.style.display = "none";
      sendResponse({ status: "Element hidden" });
    }
  } else if (request.action === "undoElement") {
    const element = document.getElementById(request.id);
    if (element) {
      element.style.display = "block";
      sendResponse({ status: "Element restored" });
    }
  }
});
