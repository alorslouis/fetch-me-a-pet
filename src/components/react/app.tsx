import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";

import { routeTree } from "../../react/routeTree.gen.ts";

import "../../styles/global.css";

const router = createRouter({
	routeTree,
	basepath: "/react",
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

type AppProps = { debounceMs?: number };

export function App(props: AppProps) {
	const { debounceMs = 200 } = props;

	const [isVisible, setIsVisible] = useState(false);

	// Debounce the app loading indicator to prevent flickering
	useLayoutEffect(() => {
		const timeout = setTimeout(() => {
			document
				.getElementById("app-loading-indicator")
				?.style.setProperty("display", "none");

			setIsVisible(true);
		}, debounceMs);

		return () => clearTimeout(timeout);
	}, [debounceMs]);

	return (
		<>
			{/* <link rel="stylesheet" href="./index.css" /> */}
			{isVisible ? (
				<RouterProvider router={router} />
			) : (
				<div className="flex flex-col my-auto mx-auto justify-center items-center text-center animate-pulse">
					<div className="flex gap-2">
						<>
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</>
					</div>
				</div>
			)}
		</>
	);
}
