/**
 * Utility functions to handle storage in both extension and web environments
 * This allows the app to work as both a web app and a browser extension
 */

// Check if running in a Chrome extension environment
const isExtension = !!window.chrome && !!window.chrome.runtime && !!window.chrome.runtime.id;

/**
 * Get an item from storage (Chrome storage or localStorage)
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {Promise<any>} - The stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  return new Promise((resolve) => {
    if (isExtension) {
      // Chrome extension environment
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    } else {
      // Web environment
      const value = localStorage.getItem(key);
      if (value === null) {
        resolve(defaultValue);
      } else {
        try {
          resolve(JSON.parse(value));
        } catch (e) {
          resolve(value);
        }
      }
    }
  });
};

/**
 * Set an item in storage (Chrome storage or localStorage)
 * @param {string} key - The storage key
 * @param {any} value - The value to store
 * @returns {Promise<void>}
 */
export const setStorageItem = (key, value) => {
  return new Promise((resolve) => {
    if (isExtension) {
      // Chrome extension environment
      const data = {};
      data[key] = value;
      chrome.storage.sync.set(data, resolve);
    } else {
      // Web environment
      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    }
  });
};

/**
 * Remove an item from storage
 * @param {string} key - The key to remove
 * @returns {Promise<void>}
 */
export const removeStorageItem = (key) => {
  return new Promise((resolve) => {
    if (isExtension) {
      chrome.storage.sync.remove(key, resolve);
    } else {
      localStorage.removeItem(key);
      resolve();
    }
  });
}; 