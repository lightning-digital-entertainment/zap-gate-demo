import { Blurhash } from "react-blurhash";
import useUnlocked from "../hooks/useUnlocked";
import ZapGateEvent from "../routes/ZapGateEvent";

type PostCardProps = {
    event: ZapGateEvent;
};

function PostCard({ event }: PostCardProps) {
    const isUnlocked = useUnlocked(event.id);
    return (
        <div>
            {isUnlocked ? (
                <img src={event.url} />
            ) : (
                <Blurhash
                    hash={event.preview[1]}
                    width={"18rem"}
                    height={"18rem"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                />
            )}
        </div>
    );
}

export default PostCard;
