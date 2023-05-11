import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import {
    metadata,
    getZapInvoice,
} from "./utils/nostr";
import QRCode from "react-qr-code";
function App() {
    const [invoice, setInvoice] = useState("");
    const [image, setImage] = useState();
    useEffect(() => {
        let interval: number;
        if (invoice && !image) {
            interval = window.setInterval(() => {
                console.log("Runs");
            }, 3000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [invoice, image]);
    return (
        <div className="absolute inset-0">
            <div className="flex w-full h-full justify-evenly items-center flex-col">
                <h1 className="text-5xl">ZapGate Demo</h1>
                <div className="w-72 h-72 bg-zinc-700 rounded justify-center items-center relative flex">
                    <Blurhash
                        hash="LHJZSZ9bE05T}:5Tt6I;G]xDvz=w"
                        width={"94%"}
                        height={"94%"}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                    <div className="absolute inset-0 flex justify-center items-center">
                        <button
                            className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                            onClick={async () => {
                                const pr = await getZapInvoice(
                                    "egge@getcurrent.io",
                                    21,
                                    metadata.pubkey,
                                    metadata.id
                                );
                                setInvoice(pr);
                            }}
                        >
                            Zap to unlock!
                        </button>
                    </div>
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
