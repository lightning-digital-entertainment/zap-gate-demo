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
import Contact from "./routes/Contact.tsx";
import ZapGateEvent from "./routes/ZapGateEvent.ts";

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
                path: "contact",
                element: <Contact />,
            },
            {
                path: "post/:eventId",
                element: <Post />,
                loader: async ({ params }) => {
                    const event = await getEventById(params.eventId);
                    if (!event || event.kind !== 121121) {
                        throw new Error("Invalid event");
                    }
                        const zapGateEvent = new ZapGateEvent(event);
                        return zapGateEvent;
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
