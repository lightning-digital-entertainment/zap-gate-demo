import Feed from "./components/Feed";
import useFeed from "./hooks/useFeed";

function App() {
    useFeed();
    return (
        <div className="flex w-full h-[calc(100%-102px)] items-center flex-col overflow-scroll">
            <h2 className="font-main font-bold">Latest posts</h2>
            <Feed/>
        </div>
    );
}

export default App;
