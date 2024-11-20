// Attach the event listener after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', () => {
    const setting = document.getElementById('setting1').value;
    chrome.storage.sync.set({ setting1: setting }, () => {
      alert('Settings saved!');
    });
  });
});