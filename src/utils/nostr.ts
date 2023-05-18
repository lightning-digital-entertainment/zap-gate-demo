import {
    getEventHash,
    getPublicKey,
    nip19,
    signEvent,
} from "nostr-tools";

import { EventTemplate, Event } from "nostr-tools";
import { pool } from "../main";

export interface ResponseError extends Error {
    status?: number;
}

declare global {
    interface Window {
        nostr: Nostr;
    }
}

const relays = ["wss://nostr1.current.fyi", "wss://wc1.current.ninja"];

type Nostr = {
    getPublicKey(): Promise<string>;
    signEvent(event: EventTemplate): Promise<Event>;
};

export async function getZapInvoice(
    lud16: string,
    amount: number,
    targetPubkey: string,
    targetEventId: string,
    relays: string[],
    sk: string | undefined
) {
    const [username, domain] = lud16.split("@");
    const zapRequest = await buildZapEvent(
        amount,
        targetPubkey,
        targetEventId,
        relays,
        sk
    );
    const initRes = await fetch(
        `https://${domain}/.well-known/lnurlp/${username}`
    );
    if (initRes.status !== 200) {
        throw new Error("Request failed");
    }
    const { callback, allowsNostr } = await initRes.json();
    if (!allowsNostr) {
        throw new Error("Provider not nostr enabled...");
    }
    const cbReq = await fetch(
        `${callback}?amount=${amount * 1000}&nostr=${zapRequest}`
    );
    const cbData = await cbReq.json();
    return cbData.pr;
}

export async function getEventById(eventId: string | undefined) {
    if (!eventId) {
        return null;
    }
    const { data, type } = nip19.decode(eventId);
    if (type !== "nevent" && type !== "note") {
        throw new Error("Invalid event");
    }
    if (type === "nevent") {
        console.log(data.relays);
        if (!data.relays) {
            const res = await pool.get(relays, { ids: [data.id] });
            return res;
        } else {
            const res = await pool.get(data.relays, { ids: [data.id] });
            return res;
        }
    }
    if (type === "note") {
        const res = await pool.get(relays, { ids: [data] });
        return res;
    }
}

export async function buildZapEvent(
    amount: number,
    targetPubkey: string,
    targetEventId: string,
    relays: string[],
    sk: string | undefined
) {
    if (sk) {
        const pk = getPublicKey(sk);
        const event = {
            kind: 9734,
            content: "ZapGate Demo",
            pubkey: pk,
            tags: [
                ["relays", ...relays],
                ["amount", String(amount * 1000)],
                ["p", targetPubkey],
                ["e", targetEventId],
            ],
            created_at: Math.floor(Date.now() / 1000),
            id: "",
            sig: "",
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        return encodeURI(JSON.stringify(event));
    } else {
        const event = {
            kind: 9734,
            content: "ZapGate Demo",
            tags: [
                ["relays", ...relays],
                ["amount", String(amount * 1000)],
                ["p", targetPubkey],
                ["e", targetEventId],
            ],
            created_at: Math.floor(Date.now() / 1000),
        };
        const signedEvent = await window.nostr.signEvent(event);
        return encodeURI(JSON.stringify(signedEvent));
    }
}

export async function createNip98GetEvent(url: string, sk?: string) {
    if (!window.nostr && !sk) {
        throw new Error("No nip07 provider or key found...");
    }
    if (sk) {
        const pk = getPublicKey(sk);
        const event = {
            content: "",
            kind: 27235,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["u", url],
                ["method", "GET"],
            ],
            id: "",
            sig: "",
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const encodedEvent = window.btoa(JSON.stringify(event));
        return encodedEvent;
    } else {
        const event = {
            content: "",
            kind: 27235,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["u", url],
                ["method", "GET"],
            ],
        };
        const signedEvent = await window.nostr.signEvent(event);
        const encodedEvent = window.btoa(JSON.stringify(signedEvent));
        return encodedEvent;
    }
}

export async function createNip98Header(
    url: string,
    method: "GET" | "POST",
    sk?: string
) {
    if (!window.nostr && !sk) {
        throw new Error("No nip07 provider or saved key found...");
    }
    if (sk) {
        const pk = getPublicKey(sk);
        const event = {
            content: "",
            kind: 27235,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["u", url],
                ["method", method],
            ],
            id: "",
            sig: "",
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const encodedEvent = window.btoa(JSON.stringify(event));
        return `Nostr ${encodedEvent}`;
    } else {
        const event = {
            content: "",
            kind: 27235,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["u", url],
                ["method", method],
            ],
        };
        const signedEvent = await window.nostr.signEvent(event);
        const encodedEvent = window.btoa(JSON.stringify(signedEvent));
        return `Nostr ${encodedEvent}`;
    }
}

export async function nip98GetImage(url: string, base64event: string) {
    const req = await fetch(url, {
        headers: {
            Authorization: `Nostr ${base64event}`,
        },
    });
    if (req.status !== 200) {
        const error: ResponseError = new Error();
        error.message = `Client error: ${req.status}`;
        error.status = req.status;
        throw error;
    }
    const reqData = await req.blob();
    return URL.createObjectURL(reqData);
}
