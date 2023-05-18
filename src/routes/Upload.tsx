import { useRef } from "react";
import { uploadZapGateFile } from "../utils/upload";
import { pool } from "../main";
import { getEventHash, getPublicKey, nip19, signEvent } from "nostr-tools";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAppSelector } from "../hooks/useAppSelector";
import { FaUpload } from "react-icons/fa";

function Upload() {
    const navigate = useNavigate();

    const fileRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const zapRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const savedKey = useAppSelector((state) => state.nostr.key);

    const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (
            !fileRef.current ||
            !fileRef.current.files ||
            fileRef.current.files.length === 0
        ) {
            throw new Error("No files!");
        }
        if (!amountRef.current?.value || !zapRef.current?.value) {
            throw new Error("No amount or destination!");
        }
        let pubkey;
        if (savedKey) {
            pubkey = getPublicKey(savedKey);
        } else {
            pubkey = await window.nostr.getPublicKey();
        }
        const amount = amountRef.current.value;
        const dest = zapRef.current.value;
        const mime = fileRef.current.files[0].type;
        const file = fileRef.current.files[0];
        const content = descriptionRef.current?.value;
        const zapGateEvent = await uploadZapGateFile(
            pubkey,
            mime,
            amount,
            dest,
            file,
            content,
            savedKey
        );
        let signedEvent;
        if (savedKey) {
            zapGateEvent.id = getEventHash(zapGateEvent);
            zapGateEvent.sig = signEvent(zapGateEvent, savedKey);
            signedEvent = zapGateEvent;
        } else {
            signedEvent = await window.nostr.signEvent(zapGateEvent);
        }
        const relays = zapGateEvent.tags
            .filter((tag) => tag[0] === "relays")[0]
            .slice(1);
        const pub = pool.publish(relays, signedEvent);
        pub.on("ok", () => {
            console.log("Published!");
        });
        const bech32Id = nip19.neventEncode({
            id: signedEvent.id,
            relays: relays,
        });
        navigate(`/post/${bech32Id}`);
    };

    return (
        <div className="flex justify-center flex-col items-center">
            <h2 className="text-center text-xl my-4">
                Upload your own zap gated image
            </h2>
            <form
                className="flex flex-col justify-center p-4 bg-zinc-700 rounded max-w-xl"
                onSubmit={submitHandler}
            >
                <div className="flex my-2 flex-col">
                    <label htmlFor='asset' className="flex flex-row py-1 px-2 bg-current-500 items-center justify-center rounded text-zinc-900"><FaUpload/><p className="ml-2">Select Image</p></label>
                    <input type="file" id="asset" name="asset" ref={fileRef} className="hidden"/>
                </div>
                <div className="flex my-2 flex-col">
                    <label>Price in SATS</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        ref={amountRef}
                        className="bg-zinc-800 text-white rounded"
                    />
                </div>
                <div className="flex my-2 flex-col mb-4">
                    <label>Lightning Address (for receiving zaps)</label>
                    <input
                        type="text"
                        id="zapTarget"
                        name="zapTarget"
                        ref={zapRef}
                        className="bg-zinc-800 text-white rounded"
                    />
                </div>
                <div className="flex my-2 flex-col mb-4">
                    <label>Post Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        ref={descriptionRef}
                        className="bg-zinc-800 text-white rounded"
                    />
                </div>
                <Button text="Submit" />
            </form>
        </div>
    );
}

export default Upload;
