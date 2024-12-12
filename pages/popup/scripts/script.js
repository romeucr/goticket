"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const projectSelector = document.getElementById("project-selector");
  const ticketInput = document.getElementById("ticket-input");
  const submitButton = document.getElementById("submit-btn");

  // Fetch the user's project list from Chrome storage
  async function getUserProjectList() {
    try {
      return await new Promise((resolve, reject) => {
        chrome.storage.sync.get("userProjectList", (data) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(data.userProjectList || []);
        });
      });
    } catch (error) {
      console.error("Error retrieving user project list:", error);
      return [];
    }
  }

  // Populate the project selector dropdown
  async function populateProjectSelector() {
    const userProjectList = await getUserProjectList();

    userProjectList.forEach((project, index) => {
      const option = document.createElement("option");
      const projectName = project.split(" - ")[0]; // Extract the first part before " - "

      option.value = projectName;
      option.text = projectName;
      if (index === 0) {
        option.selected = true;
      }

      projectSelector.appendChild(option);
    });
  }

  // Open a Jira ticket in a new or existing tab
  function openJiraTicket() {
    const projectName = projectSelector.value;
    const ticketNumber = ticketInput.value.trim();
    const isNumericTicket = /^\d+$/.test(ticketNumber);

    const url = `https://jira.tid.es/browse/${
      isNumericTicket ? `${projectName}-${ticketNumber}` : ticketNumber
    }`;

    chrome.tabs.query({ url }, (tabs) => {
      if (tabs.length > 0) {
        const tabToFocus = tabs[0];
        chrome.windows.update(tabToFocus.windowId, { focused: true });
        chrome.tabs.update(tabToFocus.id, { highlighted: true });
      } else {
        chrome.tabs.create({ url });
      }
    });
  }

  // Attach event listeners
  function attachEventListeners() {
    submitButton.addEventListener("click", openJiraTicket);

    ticketInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        openJiraTicket();
      }
    });
  }

  // Initialize the script
  function init() {
    populateProjectSelector();
    attachEventListeners();
  }

  init();
});
