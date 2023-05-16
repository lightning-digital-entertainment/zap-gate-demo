type ButtonProps = {
  onClick? : React.MouseEventHandler<HTMLButtonElement>;
  text: string
}

function Button({onClick, text}: ButtonProps) {
    return (
        <button
            className="px-2 py-1 bg-current-500 rounded hover:bg-yellow-400 text-zinc-900"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;
