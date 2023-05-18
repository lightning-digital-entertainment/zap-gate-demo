import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addUnlock, setKey } from "./state/nostrSlice";

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: addUnlock,
  effect: (action) => {
    const storedUnlocks = window.localStorage.getItem('unlockedPosts');
    if (storedUnlocks) {
      const parsedUnlocks: string[] = JSON.parse(storedUnlocks);
      parsedUnlocks.push(action.payload)
      const newUnlocks = JSON.stringify(parsedUnlocks);
      window.localStorage.setItem('unlockedPosts', newUnlocks);
    } else {
      const newUnlocks = JSON.stringify([action.payload]);
      window.localStorage.setItem('unlockedPosts', newUnlocks);
    }
  }
})

listenerMiddleware.startListening({
  actionCreator: setKey,
  effect: (action) => {
    window.localStorage.setItem('key', action.payload)
  }
})

export default listenerMiddleware;