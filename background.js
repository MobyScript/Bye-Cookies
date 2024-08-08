chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ elements: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addElement") {
    chrome.storage.sync.get("elements", (data) => {
      const elements = data.elements || [];
      elements.push(request.id);
      chrome.storage.sync.set({ elements: elements });
      sendResponse({ status: "Element added" });
    });
    return true; // Will respond asynchronously.
  }
});
