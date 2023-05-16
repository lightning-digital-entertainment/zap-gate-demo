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
import { Provider } from "react-redux";
import { store } from "./store.ts";

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
                loader: async ({ params }) => {
                    const event = await getEventById(params.eventId);
                    if (!event || event.kind !== 121121) {
                        throw new Error("Invalid event");
                    }
                    try {
                        const url = event.tags.filter(
                            (item) => item[0] === "url"
                        )[0][1];
                        const amount = event.tags.filter(
                            (item) => item[0] === "amount"
                        )[0];
                        const zap = event.tags.filter(
                            (item) => item[0] === "zap"
                        )[0];
                        const relays = event.tags.filter(
                            (item) => item[0] === "relays"
                        )[0];
                        const preview = event.tags.filter(
                            (item) => item[0] === "preview"
                        )[0];
                        console.log(url, amount, zap);
                        console.log(event);
                        return { event, url, amount, zap, relays, preview };
                    } catch (e) {
                        console.log(e);
                    }
                },
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
