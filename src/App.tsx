import Feed from "./components/Feed";
import useFeed from "./hooks/useFeed";

function App() {
    useFeed();
    return (
        <div className="flex w-full h-full items-center flex-col overflow-scroll">
            <h2>Latest posts</h2>
            <Feed/>
        </div>
    );
}

export default App;
