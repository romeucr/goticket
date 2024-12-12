"use strict";

document.addEventListener("DOMContentLoaded", () => {

  function getUserProjectList() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('userProjectList', (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.userProjectList || []);
      });
    });
  }

  getUserProjectList()
    .then((userProjectList) => {
      userProjectList.forEach((project, index) => {
        const option = document.createElement('option');
        let projectNameSplit = project.split(" - ")[0]; // Split by " - " and take the first part
        option.value = projectNameSplit;
        option.text = projectNameSplit;
        if (index === 0) {
          option.selected = true;
        }
        let projectSelector = document.getElementById('project-selector');

        projectSelector.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error retrieving user project list:', error);
    });

  function openJiraTicket() {
    const projectName = document.getElementById("project-selector").value;
    const ticketNumber = document.getElementById("ticket-input").value.trim();

    const ticketContainsOnlyNumber = /^\d+$/.test(ticketNumber);

    const url = `https://jira.tid.es/browse/${ticketContainsOnlyNumber ? projectName + "-" + ticketNumber : ticketNumber}`;

    chrome.tabs.query({url: url}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, {active: true});
      } else {
        chrome.tabs.create({url: url});
      }
    });
  }

  document.getElementById('submit-btn').onclick = openJiraTicket;

  document.getElementById('ticket-input').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      openJiraTicket();
    }
  });

});