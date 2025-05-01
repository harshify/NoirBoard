// Background script for NoirBoard Chrome Extension

// Handle installation or update
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('NoirBoard extension installed');
    
    // Initialize any default settings if needed
    chrome.storage.sync.get(['budget', 'expenses'], (result) => {
      if (!result.budget) {
        chrome.storage.sync.set({ budget: 50000 });
      }
      
      if (!result.expenses) {
        chrome.storage.sync.set({ expenses: [] });
      }
    });
  } else if (reason === 'update') {
    console.log('NoirBoard extension updated');
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_DATA') {
    // Retrieve data from storage
    chrome.storage.sync.get(null, (data) => {
      sendResponse({ success: true, data });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'SAVE_DATA') {
    // Save data to storage
    chrome.storage.sync.set(message.data, () => {
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for async response
  }
}); 