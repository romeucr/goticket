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

  let source = document.getElementById('availableProjects');
  let destination = document.getElementById('selectedProjects');

  getUserProjectList()
    .then((userProjectList) => {

      // remove from projectList the projects that are already in userProjectList
      userProjectList.forEach((project) => {
        if (projectList.includes(project)) {
          projectList = projectList.filter((item) => item !== project);
        }
      });

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
    saveSelectedList()
  });

  removeButton.addEventListener('click', () => {
    moveSelected(destination, source);
    saveSelectedList()
  });

  addAllButton.addEventListener('click', () => {
    moveAll(source, destination);
    saveSelectedList()
  });

  removeAllButton.addEventListener('click', () => {
    moveAll(destination, source);
    saveSelectedList()
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

  function saveSelectedList() {
    const destinationOptions = Array.from(destination.options); // Convert options to an array
    const updatedDestinationOptions = destinationOptions.map(option => option.text); // Map each option to its text content

    // Save the updated lists
    chrome.storage.sync.set({userProjectList: updatedDestinationOptions}, () => {
    });
  }

});