import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { worker } from "./mocks/server";

const container = document.getElementById("root")!;
const root = createRoot(container);

if (process.env.NODE_ENV === "development2") {
	await worker.start().then((r) =>
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
