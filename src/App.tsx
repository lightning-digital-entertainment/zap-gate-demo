import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import { getMetadata } from "./utils/nostr";
function App() {
  const [invoice, setInvoice] = useState('');
  useEffect(() => {
    getMetadata();
  }, [])
    return (
        <div className="absolute inset-0">
            <div className="flex w-full h-full justify-evenly items-center flex-col">
                <h1 className="text-5xl">ZapGate Demo</h1>
                <div className="w-72 h-72 bg-zinc-700 rounded justify-center items-center relative flex">
                    <Blurhash
                        hash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                        width={"94%"}
                        height={"94%"}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                    <div className="absolute inset-0 flex justify-center items-center">
                        <button className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600" onClick={() => {setInvoice('Invoice')}}>
                            Zap to unlock!
                        </button>
                    </div>
                    {invoice ? <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-full h-full bg-zinc-700 rounded">
                            Pay Invoice!
                        </div>
                    </div> : undefined}
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
