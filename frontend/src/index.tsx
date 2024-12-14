import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { worker } from "./mocks/server";

const container = document.getElementById("root")!;
const root = createRoot(container);

if (process.env.USE_MOCK === "yes") {
    await worker.start().then(() =>
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
        ),
    );
} else {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
