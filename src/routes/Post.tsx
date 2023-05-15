import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { useLoaderData } from "react-router-dom";
import { createNip98GetEvent, getZapInvoice, nip98GetImage } from "../utils/nostr";
import QRCode from "react-qr-code";
import { Event } from "nostr-tools";
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";

function Post() {

    // Workaround because useLoaderData does not support Type generics yet!!
    const data = useLoaderData() as {url: string, zap: string[], event: Event, relays: string[]};
    const [image, setImage] = useState("");
    const [invoice, setInvoice] = useState("");
    return (
        <div className="flex w-full h-full justify-evenly items-center flex-col">
            <div className="w-72 h-auto bg-zinc-700 rounded justify-center items-center relative flex my-4 p-2 overflow-hidden">
                {!image ? (
                    <Blurhash
                        hash="LHJZSZ9bE05T}:5Tt6I;G]xDvz=w"
                        width={"18rem"}
                        height={"18rem"}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                ) : (
                    <img src={image} className="rounded object-cover" />
                )}
                {invoice && !image ? (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <QRCode
                            value={invoice}
                            className="w-full h-full bg-slate-50 p-4 rounded"
                        />
                    </div>
                ) : undefined}
            </div>
            {!image ? (
                    <div className="justify-around flex w-72 items-center">
                        <SecondaryButton text="Zap to unlock!" onClick={async () => {
                                const pr = await getZapInvoice(
                                    data.zap[1],
                                    21,
                                    data.event.pubkey,
                                    data.event.id,
                                    data.relays.slice(1)
                                );
                                const signedEvent = await createNip98GetEvent(
                                    data.url
                                );
                                const interval = window.setInterval(async () => {
                                    try {
                                        const image = await nip98GetImage(
                                            data.url,
                                            signedEvent
                                        );
                                        setImage(image);
                                        setInvoice('');
                                        clearInterval(interval);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    console.log(invoice);
                                }, 1500);
                                setInvoice(pr);
                            }}/>
                        <Button onClick={async () => {
                                const signedEvent = await createNip98GetEvent(
                                    data.url
                                );
                                const image = await nip98GetImage(
                                    data.url,
                                    signedEvent
                                );
                                setImage(image);
                            }} text="Restore"/>
                    </div>
                ) : undefined}
        </div>
    );
}

export default Post;
