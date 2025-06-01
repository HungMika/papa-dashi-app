import type { PersistStorage, StorageValue } from 'zustand/middleware';

export const customStorage: PersistStorage<any> = {
  getItem: (name) => {
    let storedValue: string | null;
    if (typeof window !== 'undefined' && window.electronAPI) {
      storedValue = window.electronAPI.getUserData(name);
    } else {
      storedValue = localStorage.getItem(name);
    }

    if (!storedValue) return null;

    try {
      return JSON.parse(storedValue) as StorageValue<any>;
    } catch (e) {
      console.error('Failed to parse stored value', e);
      return null;
    }
  },

  setItem: (name, value) => {
    const stringified = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.setUserData(name, stringified);
    } else {
      localStorage.setItem(name, stringified);
    }
  },

  removeItem: (name) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.removeUserData(name);
    } else {
      localStorage.removeItem(name);
    }
  },
};
