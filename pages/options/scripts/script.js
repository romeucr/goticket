// Attach the event listener after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const clearButton = document.getElementById('clear-button');

  saveButton.addEventListener('click', () => {
    const newProject = document.getElementById('project-input').value.toUpperCase();
    chrome.storage.sync.get('projectList', (result) => {
      const currentProjectList = result.projectList || []; // Default to an empty array if not set

      if (!Array.isArray(currentProjectList)) {
        console.error('projectList is not a list!');
        return;
      }

      // Add the new value to the list
      if (!currentProjectList.includes(newProject)) {
        currentProjectList.push(newProject);

        // Save the updated list
        chrome.storage.sync.set({projectList: currentProjectList}, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving the list:', chrome.runtime.lastError);
          } else {
            alert(`Project ${newProject} added to the list!`);
          }

          // Clear the input field
          document.getElementById('project-input').value = '';
          console.log('Updated project list:', currentProjectList);
        });
      } else {
        alert(`Project ${newProject} already exists in the list!`);
      }

    });
  });

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
});