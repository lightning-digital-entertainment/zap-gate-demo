import { Event } from "nostr-tools";
import { createNip98Header } from "./nostr";

export async function uploadZapGateFile(pubkey:string, mime:string, amount:string, dest:string, file:Blob): Promise<Event> {
  const event = {
    kind: 121121,
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    content:
        "Paid Content. Please zap the amount and see the content...",
    tags: [
        ["m", mime],
        ["price", amount],
        ["zap", dest, "lud16"],
    ],
};
const formData = new FormData();
formData.set("asset", file);
formData.set("event", window.btoa(JSON.stringify(event)));
const authHeader = await createNip98Header(
    "https://zgate.current.ninja/uploadzapcontent",
    "POST"
);
const res = await fetch(
    `https://zgate.current.ninja/uploadzapcontent`,
    {
        method: "POST",
        body: formData,
        headers: {
            Authorization: authHeader,
        },
    }
);
if (res.status !== 200) {
    throw new Error('Request failed!')
}
const data = await res.json();
if (data.message !== 'success') {
    throw new Error('Request failed!')
}
return data.data;
}