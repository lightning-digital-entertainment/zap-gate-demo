import { Blurhash } from "react-blurhash";
import useUnlocked from "../hooks/useUnlocked";
import { SerializableZapGateEvent } from "../routes/ZapGateEvent";
import { nip19 } from "nostr-tools";
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUnlock } from "../state/nostrSlice";
import { createNip98GetEvent, nip98GetImage } from "../utils/nostr";

type PostCardProps = {
    event: SerializableZapGateEvent;
};

function PostCard({ event }: PostCardProps) {
    const isUnlocked = useUnlocked(event.id);
    const [image, setImage] = useState('')
    const dispatch = useDispatch();
    return (
        <div className="m-4 p-4 bg-zinc-800 flex flex-col rounded items-center max-w-xs">
            <p>{nip19.npubEncode(event.eventData.pubkey).slice(0, 32)}...</p>
            <div className="my-2">
                {!image ? <Blurhash
                    hash={event.preview[1] || "12345678"}
                    width={"18rem"}
                    height={"18rem"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                /> : <img src={image}/>}
            </div>
            <div>{event.eventData.content}</div>
            {!isUnlocked ? (
                <div className="flex flex-row justify-between w-full">
                    <Button text={`Unlock (${event.amount} SATS)`} />
                    <SecondaryButton
                        text="Restore"
                        onClick={async () => {
                            const signedEvent = await createNip98GetEvent(
                                event.url
                            );
                            const image = await nip98GetImage(
                                event.url,
                                signedEvent
                            );
                            setImage(image);
                            dispatch(addUnlock(event.id));
                        }}
                    />
                </div>
            ) : undefined}
        </div>
    );
}

export default PostCard;
