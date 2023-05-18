export function getKeyFromStorage():string|null {
  const storedKey = window.localStorage.getItem('key');
  return storedKey
}

