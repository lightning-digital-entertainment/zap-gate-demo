type ButtonProps = {
    onClick? : React.MouseEventHandler<HTMLButtonElement>;
    text: string
  }

function SecondaryButton({onClick, text}: ButtonProps) {
    return (
        <button
            className="px-2 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default SecondaryButton;
