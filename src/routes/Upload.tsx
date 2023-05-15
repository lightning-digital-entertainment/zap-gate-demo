import { useRef } from "react";
import { getPublicKey } from "../utils/nostr";
import { uploadZapGateFile } from "../utils/upload";
import { pool } from "../main";
import { nip19 } from "nostr-tools";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Upload() {
    const navigate = useNavigate();

    const fileRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const zapRef = useRef<HTMLInputElement>(null);

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
        const pubkey = await getPublicKey();
        const amount = amountRef.current.value;
        const dest = zapRef.current.value;
        const mime = fileRef.current.files[0].type;
        const file = fileRef.current.files[0];
        const zapGateEvent = await uploadZapGateFile(pubkey, mime, amount, dest, file)
        const signedEvent = await window.nostr.signEvent(zapGateEvent)
        console.log(signedEvent);
        const relays = zapGateEvent.tags.filter(tag => tag[0] === 'relays')[0].slice(1)
        const pub = pool.publish(relays, signedEvent);
        pub.on('ok', () => {console.log('Published!')})
        const bech32Id = nip19.neventEncode({id: signedEvent.id, relays: relays});
        navigate(`/post/${bech32Id}`)
    };

    return (
        <div className="flex justify-center flex-col items-center">
            <h2 className="text-center text-xl my-4">Upload your own zap gated image</h2>
            <form
                className="flex flex-col justify-center p-4 bg-zinc-700 rounded max-w-xl"
                onSubmit={submitHandler}
            >
                <div className="flex my-2 flex-col">
                    <label>Image</label>
                    <input type="file" id="asset" name="asset" ref={fileRef} />
                </div>
                <div className="flex my-2 flex-col">
                    <label>Price in SATS</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        ref={amountRef}
                    />
                </div>
                <div className="flex my-2 flex-col mb-4">
                    <label>Your Lightning Address</label>
                    <input
                        type="text"
                        id="zapTarget"
                        name="zapTarget"
                        ref={zapRef}
                    />
                </div>
                <Button text="Submit"/>
            </form>
        </div>
    );
}

export default Upload;
