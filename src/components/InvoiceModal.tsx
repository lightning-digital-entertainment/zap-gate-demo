import React from "react";
import Modal from "./Modal";
import QRCode from "react-qr-code";
import Button from "./Button";

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
                        <p className="animate-pulse w-full text-center">
                            Awaiting payment
                        </p>
                        <Button text="Close" onClick={onClose} />
                    </div>
                </Modal>
            ) : undefined}
        </>
    );
}

export default InvoiceModal;
