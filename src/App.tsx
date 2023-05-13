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
                <div className="w-72 h-72 bg-zinc-700 rounded justify-center items-center relative flex my-4">
                    {!image ? (
                        <Blurhash
                            hash="LHJZSZ9bE05T}:5Tt6I;G]xDvz=w"
                            width={"94%"}
                            height={"94%"}
                            resolutionX={32}
                            resolutionY={32}
                            punch={1}
                        />
                    ) : (
                        <img src={image} className="rounded"/>
                    )}
                    {!image ? <div className="absolute inset-0 flex justify-center items-center">
                        <button
                            className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                            onClick={async () => {
                                const pr = await getZapInvoice(
                                    "current@getcurrent.io",
                                    21,
                                    "c6318c608d835045bf1f83f372d13d52c8dcdd67ae8c578f5f54c02e584b4f8c",
                                    "d71b28edee75a24010c1e5515d95186339470c0509c23fcc0484be4781712370"
                                );
                                setInvoice(pr);
                            }}
                        >
                            Zap to unlock!
                        </button>
                    </div> : undefined}
                    {invoice ? (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <QRCode
                                value={invoice}
                                className="w-full h-full bg-slate-50 p-4 rounded"
                            />
                        </div>
                    ) : undefined}
                </div>
                <a
                    className="text-xl hover:text-yellow-600"
                    href="https://github.com/Egge7/nips/blob/zapGates/XX.md"
                >
                    Read the spec
                </a>
            </div>
    );
}

export default App;
