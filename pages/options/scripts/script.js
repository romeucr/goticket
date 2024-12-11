// Attach the event listener after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  let projectList = [
    'ANLT - Analytics',
    'ANDROID - Android',
    'APPS - Apps Core',
    'CHECKOUT - Checkout',
    'CMS - CMS',
    'TGT - Commercial Tech',
    'ACCOUNT - Customer Account',
    'IR - Incident Report',
    'IOS - iOS',
    'LOC - Localization',
    'NOC - NOC',
    'SERVER - Novum Server Core',
    'VIVO - Novum Vivo Brasil',
    'NOVUMCC - NOVUMCC',
    'PAP - PAP',
    'QANOV - QA Novum',
    'OBVIVO - OB Novum Brasil'
  ];

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

  let source = document.getElementById('sourceList');
  let destination = document.getElementById('destinationList');

  getUserProjectList()
    .then((userProjectList) => {
      populateSelectElement(source, projectList);
      populateSelectElement(destination, userProjectList);
    })
    .catch((error) => {
      console.error('Error retrieving user project list:', error);
    });

  function populateSelectElement(selectElement, list) {
    list.forEach((project, index) => {
      const option = document.createElement('option');
      option.value = project.split(" - ")[0]; // Split by " - " and take the first part
      option.text = project;
      if (index === 0) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
  }

  const addButton = document.getElementById('addButton');
  const addAllButton = document.getElementById('addAllButton');
  const removeButton = document.getElementById('removeButton');
  const removeAllButton = document.getElementById('removeAllButton');

  addButton.addEventListener('click', () => {
    moveSelected(source, destination);
  });

  removeButton.addEventListener('click', () => {
    moveSelected(destination, source);
  });

  addAllButton.addEventListener('click', () => {
    moveAll(source, destination);
  });

  removeAllButton.addEventListener('click', () => {
    moveAll(destination, source);
  });

  function moveSelected(source, destination) {
    const selectedOptions = Array.from(source.selectedOptions);

    selectedOptions.forEach(option => {
      destination.add(option); // Move option to destination
    });

    // Sort both lists
    sortLists();
  }

  function moveAll(source, destination) {
    const allOptions = Array.from(source.options);

    // Move all options to the destination
    allOptions.forEach(option => {
      destination.add(option);
    });

    // Sort both lists
    sortLists();
  }

  function sortLists() {
    const sourceOptions = Array.from(source.options);
    const destinationOptions = Array.from(destination.options);

    // Sort options alphabetically by text content
    sourceOptions.sort((a, b) => a.value.localeCompare(b.value));
    destinationOptions.sort((a, b) => a.value.localeCompare(b.value));

    // Clear the list and re-add sorted options
    source.innerHTML = "";
    destination.innerHTML = "";
    sourceOptions.forEach(option => source.add(option));
    destinationOptions.forEach(option => destination.add(option));
  }

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', () => {

    const sourceOptions = Array.from(source.options); // Convert options to an array
    const updatedSource = sourceOptions.map(option => option.text); // Map each option to its text content

    const destinationOptions = Array.from(destination.options); // Convert options to an array
    const updatedDestinationOptions = destinationOptions.map(option => option.text); // Map each option to its text content

    // Save the updated lists
    chrome.storage.sync.set({userProjectList: updatedDestinationOptions}, () => {
    });

    chrome.storage.sync.get('userProjectList', (result) => {
      console.log('Updated userProjectList list:', result.userProjectList);
    });
  });

  //TODO: clear only userProjectList
  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing sync storage:', chrome.runtime.lastError);
      } else {
        console.log('Sync storage cleared.');
      }
    });

    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing local storage:', chrome.runtime.lastError);
      } else {
        console.log('Local storage cleared.');
      }
    });
  });

  const checkButton = document.getElementById('check-button');
  checkButton.addEventListener('click', () => {

    chrome.storage.sync.get('userProjectList', (result) => {
      console.log('Updated userProjectList list:', result.userProjectList);
    });
  });
});