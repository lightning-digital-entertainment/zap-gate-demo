import { useState } from "react";

const useLocalStorage = () => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const item = window.localStorage.getItem('zgUnlocked');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  });
  const setValue = (value: string[]) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem('zgUnlocked', JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
export default useLocalStorage;