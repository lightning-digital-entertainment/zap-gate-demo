import Feed from "./components/Feed";
import PostCard from "./components/PostCard";
import useFeed from "./hooks/useFeed";

function App() {
    useFeed();
    return (
        <div className="flex w-full h-full justify-evenly items-center flex-col">
            <Feed/>
        </div>
    );
}

export default App;
