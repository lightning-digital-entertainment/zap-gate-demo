import { useEffect, useState } from "react";

const useNip07 = () => {
  const [available, setAvailable] = useState(() => {
    return window.nostr ? true : false;
  });
  useEffect(() => {
    if (window.nostr) {
      setAvailable(true)
    } else {
      setInterval(() => {
        if (window.nostr) {
          setAvailable(true)
        }
      }, 3000)
    }
  }, [])

  return available;
};

export default useNip07;