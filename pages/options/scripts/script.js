"use strict";

document.addEventListener('DOMContentLoaded', () => {

  const projectList = [
    'ANLT - Analytics', 'ANDROID - Android', 'APPS - Apps Core',
    'CHECKOUT - Checkout', 'CMS - CMS', 'TGT - Commercial Tech',
    'ACCOUNT - Customer Account', 'IR - Incident Report', 'IOS - iOS',
    'LOC - Localization', 'NOC - NOC', 'SERVER - Novum Server Core',
    'VIVO - Novum Vivo Brasil', 'NOVUMCC - NOVUMCC', 'PAP - PAP',
    'QANOV - QA Novum', 'OBVIVO - OB Novum Brasil'
  ];

  const source = document.getElementById('availableProjects');
  const destination = document.getElementById('selectedProjects');
  const buttons = {
    add: document.getElementById('addButton'),
    addAll: document.getElementById('addAllButton'),
    remove: document.getElementById('removeButton'),
    removeAll: document.getElementById('removeAllButton'),
  };

  async function getUserProjectList() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('userProjectList', (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.userProjectList || []);
      });
    });
  }

  async function initializeProjectLists() {
    try {
      const userProjectList = await getUserProjectList();
      const availableProjects = projectList.filter(project => !userProjectList.includes(project));

      populateSelectElement(source, availableProjects);
      populateSelectElement(destination, userProjectList);
    } catch (error) {
      console.error('Error retrieving user project list:', error);
    }
  }

  function populateSelectElement(selectElement, list) {
    selectElement.innerHTML = '';
    list.forEach((project, index) => {
      const option = document.createElement('option');
      option.value = project.split(' - ')[0];
      option.text = project;
      if (index === 0) option.selected = true;
      selectElement.add(option);
    });
  }

  function moveSelected(sourceElement, destinationElement) {
    Array.from(sourceElement.selectedOptions).forEach(option => {
      destinationElement.add(option);
    });
    sortLists();
  }

  function moveAll(sourceElement, destinationElement) {
    Array.from(sourceElement.options).forEach(option => {
      destinationElement.add(option);
    });
    sortLists();
  }

  function sortLists() {
    [source, destination].forEach(element => {
      const options = Array.from(element.options);
      options.sort((a, b) => a.value.localeCompare(b.value));
      element.innerHTML = '';
      options.forEach(option => element.add(option));
    });
  }

  function saveSelectedList() {
    const updatedList = Array.from(destination.options).map(option => option.text);
    chrome.storage.sync.set({userProjectList: updatedList}, () => {
      console.log('User project list saved.');
    });
  }

  function attachEventListeners() {
    buttons.add.addEventListener('click', () => {
      moveSelected(source, destination);
      saveSelectedList();
    });

    buttons.remove.addEventListener('click', () => {
      moveSelected(destination, source);
      saveSelectedList();
    });

    buttons.addAll.addEventListener('click', () => {
      moveAll(source, destination);
      saveSelectedList();
    });

    buttons.removeAll.addEventListener('click', () => {
      moveAll(destination, source);
      saveSelectedList();
    });
  }

  // Initialize
  initializeProjectLists();
  attachEventListeners();
});