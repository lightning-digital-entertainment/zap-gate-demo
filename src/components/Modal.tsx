import ReactDOM from "react-dom";
import { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
};

function Modal({ children }: ModalProps) {
    return ReactDOM.createPortal(
        <>
            <div className="absolute inset-0 bg-zinc-950 opacity-95 flex justify-center items-center" />
            <div className="absolute inset-0 flex justify-center items-center">{children}</div>
        </>,
        document.getElementById("modal") as HTMLElement
    );
}

export default Modal;
