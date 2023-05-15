import { useAppSelector } from "./useAppSelector";

const useUnlocked = (eventId: string) => {
  const unlocked = useAppSelector(state => state.nostr.unlocked);
  return unlocked.includes(eventId) ? true : false
};

export default useUnlocked;