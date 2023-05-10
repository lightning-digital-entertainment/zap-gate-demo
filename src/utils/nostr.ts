import { relayInit } from "nostr-tools";

const relay = relayInit("wss://nostr-pub.wellorder.net");

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

export async function getZapInvoice(lud16: `${string}@${string}`) {
  const [username, domain] = lud16.split('@')
  const initRes = await fetch(`https://${domain}/.well-known/lnurlp/${username}`);
  if (initRes.status !== 200) {
    throw new Error('Request failed')
  }
  const {callback, allowsNostr, nostrPubkey} = await initRes.json();
  const cbReq = await fetch(callback)
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
