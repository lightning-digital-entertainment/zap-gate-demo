export function setIntervalImmediately(func: () => void, interval: number) {
  func();
  return window.setInterval(func, interval);
}