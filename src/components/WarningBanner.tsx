import { IoWarningOutline } from "react-icons/io5";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { dismissBanner } from "../state/utilitySlice";

function WarningBanner() {
  const dispatch = useAppDispatch();
    return (
        <div className="bg-current-500 p-4 flex rounded-t shadow text-zinc-900 justify-around flex-col">
            <div className="flex flex-row">
                <div className="text-3xl mr-4 flex items-center">
                    <IoWarningOutline />
                </div>
                <div className="text-sm">
                    <p className="text-lg">Demo Application</p>
                    <p>This is a work in progress demo / PoC. Use with care!</p>
                    <button className="underline w-full text-left" onClick={() => {dispatch(dismissBanner())}}>Understood!</button>
                </div>
            </div>
        </div>
    );
}

export default WarningBanner;
