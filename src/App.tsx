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
                    "https://zgate.current.ninja/zapcontent/5PVsfHeZJYVVfVNvTQDpL2wrXX9XpDBC/1683881973077-blob"
                );
                const image = await nip98GetImage(
                    "https://zgate.current.ninja/zapcontent/5PVsfHeZJYVVfVNvTQDpL2wrXX9XpDBC/1683881973077-blob",
                    signedEvent
                );
                setImage(image);
            }
            if (invoice && !image) {
                const signedEvent = await createNip98GetEvent(
                    "https://zgate.current.ninja/zapcontent/5PVsfHeZJYVVfVNvTQDpL2wrXX9XpDBC/1683881973077-blob"
                );
                interval = window.setInterval(async () => {
                    try {
                        const image = await nip98GetImage(
                            "https://zgate.current.ninja/zapcontent/5PVsfHeZJYVVfVNvTQDpL2wrXX9XpDBC/1683881973077-blob",
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
        <div className="absolute inset-0">
            <div className="flex w-full h-full justify-evenly items-center flex-col">
                <h1 className="text-5xl">ZapGate Demo</h1>
                <div className="w-72 h-72 bg-zinc-700 rounded justify-center items-center relative flex">
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
                        <img src={image} />
                    )}
                    {!image ? <div className="absolute inset-0 flex justify-center items-center">
                        <button
                            className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                            onClick={async () => {
                                const pr = await getZapInvoice(
                                    "egge@getcurrent.io",
                                    21,
                                    "ddf03aca85ade039e6742d5bef3df352df199d0d31e22b9858e7eda85cb3bbbe",
                                    "a1b20bfe3507e6ca533aebecb12604f4d24c3fe8cc696274967ba08fa782642b"
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
        </div>
    );
}

export default App;
