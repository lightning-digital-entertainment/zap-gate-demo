import { useCallback, useEffect } from "react";
import { pool } from "../main";
import ZapGateEvent from "../routes/ZapGateEvent";
import { Event } from "nostr-tools";

const useFeed = () => {
    const handleEvent = useCallback((event: Event) => {
      const newEvent = new ZapGateEvent(event);
      newEvent.saveEvent();
    }, [])
    useEffect(() => {
        const sub = pool.sub(
            ["wss://nostr1.current.fyi", "wss://wc1.current.ninja"],
            [{ kinds: [121121], limit: 25 }]
        );
        sub.on('event', handleEvent)
        return () => {
            sub.unsub();
        };
    }, [handleEvent]);
};

export default useFeed;
