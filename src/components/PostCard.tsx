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
import { FaLock, FaShare, FaUnlock } from "react-icons/fa";

type PostCardProps = {
    event: SerializableZapGateEvent;
};

function PostCard({ event }: PostCardProps) {
    const shareData = {
        title: "My ZapGate Post",
        text: event.eventData.content,
        url: `https://zapgate.link/post/${nip19.neventEncode({id: event.id, relays: event.relays})}`
      };
    const isUnlocked = useUnlocked(event.id);
    const [isOpen, setIsOpen] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
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
        <div className="relative p-2 my-4 bg-zinc-800 flex flex-col rounded items-center max-w-xs  lg:max-w-sm">
            <div className="flex flex-row w-full justify-between">
                <p className="text-sm">
                    {nip19.npubEncode(event.eventData.pubkey).slice(0, 32)}...
                </p>
                <button onClick={async () => {
                    if (navigator.share) {
                        await navigator.share(shareData)
                    } else {
                        navigator.clipboard.writeText(`https://zapgate.link/post/${nip19.neventEncode({id: event.id, relays: event.relays})}`)
                        setShowNotice(true);
                        setTimeout(() => {
                            setShowNotice(false);
                        }, 2000)
                    }
                }}>
                    <FaShare />
                </button>
            </div>
            <div className="my-2 relative">
                {!image ? (
                    <Blurhash
                        hash={event.preview[1] || "LGF5]+Yk^6#M@-5c,1J5@[or[Q6."}
                        width={"20rem"}
                        height={"20rem"}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                ) : (
                    <img src={image} />
                )}
                {isUnlocked ? (
                    <div className="absolute top-2 right-2 text-xl text-current-500">
                        <FaUnlock />
                    </div>
                ) : <div className="absolute top-2 right-2 text-xl text-current-500">
                <FaLock />
            </div>}
                
            </div>
            <div className="w-full">{event.eventData.content}</div>
            {!image ? (
                <div className="flex flex-row justify-between w-full">
                    <Button
                        text={`Zap & Unlock (${event.amount} SATS)`}
                        onClick={async () => {
                            const pr = await getZapInvoice(
                                event.zap[0],
                                Number(event.amount),
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
                                alert("You need to Zap this item to unlock it!");
                            }
                        }}
                    />
                </div>
            ) : undefined}
            {showNotice ? <p className="absolute place-self-center top-16 p-4 bg-zinc-800 rounded">Copied!</p> : undefined}
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
