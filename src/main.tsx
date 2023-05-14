import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import Root from "./routes/Root.tsx";
import Upload from "./routes/Upload.tsx";
import { Post } from "./routes";
import { getEventById } from "./utils/nostr.ts";
import { SimplePool } from "nostr-tools";

export const pool = new SimplePool();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "", element: <App /> },
            {
                path: "upload",
                element: <Upload />,
            },
            {
                path: "post/:eventId",
                element: <Post />,
                loader: async ({params}) => {
                    const event = await getEventById(params.eventId);
                    if (!event || event.kind !== 121121) {
                        throw new Error('Invalid event')
                    }
                    return event
                }
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
