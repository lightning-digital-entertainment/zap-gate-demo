import { useLoaderData } from "react-router-dom";
import PostCard from "../components/PostCard";
import ZapGateEvent from "./ZapGateEvent";

function Post() {
    // Workaround because useLoaderData does not support Type generics yet!!
    const data = useLoaderData() as ZapGateEvent;
    return (
        <div className="flex w-full items-center flex-col">
            <PostCard event={data} />
        </div>
    );
}

export default Post;
