import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addUnlock } from "./state/nostrSlice";

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: addUnlock,
  effect: async (action) => {
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

export default listenerMiddleware;