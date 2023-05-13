import { useRef } from "react";
import { getPublicKey } from "../utils/nostr";

function Upload() {

    const fileRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const zapRef = useRef<HTMLInputElement>(null);
    
    const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fileRef.current || !fileRef.current.files || fileRef.current.files.length === 0) {
            throw new Error('No files!')
        }
        if (!amountRef.current?.value || !zapRef.current?.value) {
            throw new Error('No amount or destination!')
        }
        const pubkey = await getPublicKey();
        const amount = amountRef.current.value;
        const dest = zapRef.current.value;
        const mime = fileRef.current.files[0].type;
        const file = fileRef.current.files[0];
        const event = {
            kind: 121121,
            pubkey,
            created_at: Math.floor(Date.now() / 1000),
            content: 'Paid Content. Please zap the amount and see the content...',
            tags: [
                ["m", mime],
                ["price", amount],
                [ "zap", dest, "lud16" ]
            ]
        };
        const formData = new FormData();
        formData.set('asset', file);
        formData.set('event', window.btoa(JSON.stringify(event)))
                const res = await fetch(`https://zgate.current.ninja/uploadzapcontent`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer 57f079ac11df951da1c97ee46750befec5cbb4e8`
            }
        });
        const data = await res.json();
        console.log(data);
        console.log(data.data.tags);
    };
    
    return (
        <div>
            <form
                className="flex flex-col justify-center p-4 bg-zinc-700 m-4 rounded max-w-xl"
                onSubmit={submitHandler}
            >
                <div className="flex my-2 flex-col">
                    <label>Image</label>
                    <input type="file" id="asset" name="asset" ref={fileRef}/>
                </div>
                <div className="flex my-2 flex-col">
                    <label>Price</label>
                    <input type="number" id="price" name="price" ref={amountRef}/>
                </div>
                <div className="flex my-2 flex-col">
                    <label>Lightning Address</label>
                    <input type="text" id="zapTarget" name="zapTarget" ref={zapRef}/>
                </div>
                <button>Submit!</button>
            </form>
        </div>
    );
}

export default Upload;
