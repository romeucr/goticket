"use strict";

function openJiraTicket() {
    const projectName = document.getElementById("project-selector").value;
    const ticketNumber = document.getElementById("ticket-input").value.trim();

    const ticketContainsOnlyNumber = /^\d+$/.test(ticketNumber);

    const url = `https://jira.tid.es/browse/${ticketContainsOnlyNumber ? projectName + ticketNumber : ticketNumber}`;

    chrome.tabs.query({ url: url }, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { active: true });
        } else {
            chrome.tabs.create({ url: url });
        }
    });
}

document.getElementById('submit-btn').onclick = openJiraTicket;

document.getElementById('ticket-input').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        openJiraTicket();
    }
});