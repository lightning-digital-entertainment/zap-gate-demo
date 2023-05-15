import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import {
    getZapInvoice,
    createNip98GetEvent,
    nip98GetImage,
} from "./utils/nostr";
import QRCode from "react-qr-code";
function App() {
    const [invoice, setInvoice] = useState("");
    const [image, setImage] = useState("");
    useEffect(() => {
        let interval: number;
        async function requestZapGatedRessource() {
            if (!invoice && !image) {
                const signedEvent = await createNip98GetEvent(
                    "https://zgate.current.ninja/zapcontent/XnW7qvZUhijdxmAvgIDS7R0PeURfP86r/1683915822848-bamboo-rhino-344402-13a69538c70c.png"
                );
                const image = await nip98GetImage(
                    "https://zgate.current.ninja/zapcontent/XnW7qvZUhijdxmAvgIDS7R0PeURfP86r/1683915822848-bamboo-rhino-344402-13a69538c70c.png",
                    signedEvent
                );
                setImage(image);
            }
            if (invoice && !image) {
                const signedEvent = await createNip98GetEvent(
                    "https://zgate.current.ninja/zapcontent/XnW7qvZUhijdxmAvgIDS7R0PeURfP86r/1683915822848-bamboo-rhino-344402-13a69538c70c.png"
                );
                interval = window.setInterval(async () => {
                    try {
                        const image = await nip98GetImage(
                            "https://zgate.current.ninja/zapcontent/XnW7qvZUhijdxmAvgIDS7R0PeURfP86r/1683915822848-bamboo-rhino-344402-13a69538c70c.png",
                            signedEvent
                        );
                        setImage(image);
                        setInvoice('')
                        console.log(image);
                    } catch (e) {
                        console.log(e);
                    }
                    console.log(invoice);
                }, 1500);
            }
        }
        requestZapGatedRessource();
        return () => {
            clearInterval(interval);
        };
    }, [invoice, image]);
    return (
            <div className="flex w-full h-full justify-evenly items-center flex-col">
            </div>
    );
}

export default App;
