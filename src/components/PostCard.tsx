import { Blurhash } from "react-blurhash";
import useUnlocked from "../hooks/useUnlocked";
import { SerializableZapGateEvent } from "../routes/ZapGateEvent";
import { nip19 } from "nostr-tools";
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUnlock } from "../state/nostrSlice";
import {
    createNip98GetEvent,
    getZapInvoice,
    nip98GetImage,
} from "../utils/nostr";
import InvoiceModal from "./InvoiceModal";

type PostCardProps = {
    event: SerializableZapGateEvent;
};

function PostCard({ event }: PostCardProps) {
    const isUnlocked = useUnlocked(event.id);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        async function unlock() {
            const signedEvent = await createNip98GetEvent(event.url);
            const image = await nip98GetImage(event.url, signedEvent);
            setImage(image);
        }
        if (isUnlocked) {
            unlock();
        }
    }, [isUnlocked, event]);
    const [image, setImage] = useState("");
    const [invoice, setInvoice] = useState("");
    const dispatch = useDispatch();
    return (
        <div className="p-2 my-2 bg-zinc-800 flex flex-col rounded items-center max-w-xs  lg:max-w-sm">
            <p className="text-sm">
                {nip19.npubEncode(event.eventData.pubkey).slice(0, 32)}...
            </p>
            <div className="my-2">
                {!image ? (
                    <Blurhash
                        hash={event.preview[1] || "12345678"}
                        width={"20rem"}
                        height={"20rem"}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                ) : (
                    <img src={image} />
                )}
            </div>
            <div className="w-full">{event.eventData.content}</div>
            {!image ? (
                <div className="flex flex-row justify-between w-full">
                    <Button
                        text={`Unlock (${event.amount} SATS)`}
                        onClick={async () => {
                            const pr = await getZapInvoice(
                                event.zap[0],
                                21,
                                event.eventData.pubkey,
                                event.id,
                                event.relays
                            );
                            const signedEvent = await createNip98GetEvent(
                                event.url
                            );
                            const interval = window.setInterval(async () => {
                                try {
                                    const image = await nip98GetImage(
                                        event.url,
                                        signedEvent
                                    );

                                    setImage(image);
                                    setInvoice("");
                                    clearInterval(interval);
                                    dispatch(addUnlock(event.id));
                                    setIsOpen(false);
                                } catch (e) {
                                    console.log(e);
                                }
                                console.log(invoice);
                            }, 1500);
                            setInvoice(pr);
                            setIsOpen(true);
                        }}
                    />
                    <SecondaryButton
                        text="Restore"
                        onClick={async () => {
                            const signedEvent = await createNip98GetEvent(
                                event.url
                            );
                            try {
                                const image = await nip98GetImage(
                                    event.url,
                                    signedEvent
                                );
                                setImage(image);
                                dispatch(addUnlock(event.id));
                            } catch {
                                alert("Could not unlock image");
                            }
                        }}
                    />
                </div>
            ) : undefined}
            <InvoiceModal
                isOpen={isOpen}
                invoice={invoice}
                onClose={() => {
                    setIsOpen(false);
                }}
            />
        </div>
    );
}

export default PostCard;
