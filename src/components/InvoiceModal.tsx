import React from "react";
import Modal from "./Modal";
import QRCode from "react-qr-code";
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";

declare global {
    interface Window {
        webln: WebLn;
    }
}

type WebLn = {
    enable(): void;
    sendPayment(paymentRequest: string): Promise<SendPaymentResponse>;
};

interface SendPaymentResponse {
    preimage: string;
}

type InvoiceModalProps = {
    invoice: string;
    isOpen: boolean;
    onClose: React.MouseEventHandler<HTMLButtonElement>;
};

function InvoiceModal({ invoice, onClose, isOpen }: InvoiceModalProps) {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }

    return (
        <>
            {isOpen ? (
                <Modal>
                    <div className="bg-zinc-800 p-4 rounded justify-center flex-col items-center">
                        <div className="bg-white p-4 rounded">
                            <QRCode value={invoice} />
                        </div>
                        <p className="animate-pulse w-full text-center mb-4">
                            Awaiting payment
                        </p>
                        <div className="flex flex-row justify-between">
                            <Button text="Copy Invoice" onClick={() => {navigator.clipboard.writeText(invoice)}}/>
                            <SecondaryButton text="Close" onClick={onClose} />
                        </div>
                    </div>
                </Modal>
            ) : undefined}
        </>
    );
}

export default InvoiceModal;
