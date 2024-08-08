chrome.storage.sync.get("elements", (data) => {
  const elements = data.elements || [];
  elements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  });
});
