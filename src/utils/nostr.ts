import { relayInit } from "nostr-tools";

import { EventTemplate, Event } from "nostr-tools";

declare global {
    interface Window {
        nostr: Nostr;
    }
}

type Nostr = {
    getPublicKey(): Promise<string>;
    signEvent(event: EventTemplate): Promise<Event>;
};

const relayUrl = "wss://wc1.current.ninja";

const relay = relayInit(relayUrl);

export async function getMetadata() {
    if (relay.status !== 1) {
        await relay.connect();
    }
    const data = await relay.get({
        authors: [
            "ddf03aca85ade039e6742d5bef3df352df199d0d31e22b9858e7eda85cb3bbbe",
        ],
        kinds: [0],
    });
    return data;
}

export async function getZapInvoice(
    lud16: `${string}@${string}`,
    amount: number,
    targetPubkey: string,
    targetEventId: string
) {
    const [username, domain] = lud16.split("@");
    const zapRequest = await buildZapEvent(amount, targetPubkey, targetEventId);
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

export async function getEventById(eventId: string | undefined) {
    if (!eventId) {
        return
    }
    const data = await relay.get({ids: [eventId]});
    return data
}

export async function getPublicKey() {
    return await window.nostr.getPublicKey();
}

export const metadata = {
    id: "6b41daa041c0435bc78b3b16f9b1ebfb08e6798e82c1f2aaa5eb094323992d80",
    pubkey: "ddf03aca85ade039e6742d5bef3df352df199d0d31e22b9858e7eda85cb3bbbe",
    created_at: 1681193351,
    kind: 0,
    tags: [],
    content:
        '{"name":"egge","nip05":"egge@getcurrent.io","about":"Building current; a nostr + bitcoin client! https://app.getcurrent.io 💜⚡️🧡 | pro zapper!!","picture":"https://i.current.fyi/ddf03aca85ade039/profile/avatar_46978.png","lud16":"egge@getcurrent.io"}',
    sig: "95abf09e94f92a597d324fdb14e08df3ec092ce2f16cb64d516429a72c9c691058dfe5c99d5a85f405ca7655e81ce70cbd5b716198dbf8c7d901ebba123ffdde",
};

// async function getZapInvoice() {}

export async function buildZapEvent(
    amount: number,
    targetPubkey: string,
    targetEventId: string
) {
    const event = {
        kind: 9734,
        content: "ZapGate Demo",
        tags: [
            ["relays", relayUrl],
            ["amount", String(amount * 1000)],
            ["p", targetPubkey],
            ["e", targetEventId],
        ],
        created_at: Math.floor(Date.now() / 1000),
    };
    const signedEvent = await window.nostr.signEvent(event);
    return encodeURI(JSON.stringify(signedEvent));
}

export async function createNip98GetEvent(url: string) {
    if (!window.nostr) {
        throw new Error('No nip07 provider found...')
    }
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

export async function nip98GetImage(url: string, base64event: string) {
    const req = await fetch(url, {
        headers: {
            "Authorization": `Nostr ${base64event}`
        }
    })
    if (req.status !== 200) {
        throw new Error(`Client error: ${req.status}`)
    }
    const reqData = await req.blob()
    return URL.createObjectURL(reqData);
}
