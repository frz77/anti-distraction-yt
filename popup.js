const btn = document.getElementById('toggleBtn');

// Проверяем текущее состояние при открытии
chrome.storage.local.get(['isEnabled'], (result) => {
  const isEnabled = result.isEnabled !== false; // По умолчанию true
  updateUI(isEnabled);
});

btn.addEventListener('click', () => {
  chrome.storage.local.get(['isEnabled'], (result) => {
    const newState = !(result.isEnabled !== false);
    chrome.storage.local.set({ isEnabled: newState }, () => {
      updateUI(newState);
      // Перезагружаем текущую вкладку YouTube
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url.includes("youtube.com")) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
});

function updateUI(isEnabled) {
  btn.textContent = isEnabled ? 'Enabled' : 'Disabled';
  btn.className = isEnabled ? 'toggle-btn active' : 'toggle-btn';
}