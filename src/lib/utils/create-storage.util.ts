import { createJSONStorage } from 'zustand/middleware';

export default function createStorage() {
  return createJSONStorage(() => {
    if (typeof window === 'undefined') {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }
    return localStorage;
  });
}
