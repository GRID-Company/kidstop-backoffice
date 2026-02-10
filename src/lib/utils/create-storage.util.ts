import { createJSONStorage } from 'zustand/middleware';

type StorageType = 'local' | 'session';

export default function createStorage(type: StorageType = 'local') {
  return createJSONStorage(() => {
    if (typeof window === 'undefined') {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }
    return type === 'session' ? sessionStorage : localStorage;
  });
}
