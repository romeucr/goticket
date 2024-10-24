chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: "Open ticket in Jira",
      contexts: ["selection"],
      id: "open-in-jira"
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-in-jira") {
    // Inject script into the active tab to get the selected text
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getSelectedText,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const selectedText = results[0].result;
          let url = `https://jira.tid.es/browse/${selectedText}`

          chrome.tabs.query({ url: url }, (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.update(tabs[0].id, { active: true });
            } else {
              chrome.tabs.create({ url: url });
            }
          });
        } else {
          alert("No text selected");
        }
      }
    );
  }
});

// Function to get the selected text
function getSelectedText() {
  return window.getSelection().toString();
}

