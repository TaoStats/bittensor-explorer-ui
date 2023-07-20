import { Navigate, createBrowserRouter, redirect } from "react-router-dom";

import { ResultLayout } from "./components/ResultLayout";
import { getNetwork } from "./services/networksService";
import { encodeAddress } from "./utils/formatAddress";

import { AccountPage } from "./screens/account";
import { BlockPage } from "./screens/block";
import { CallPage } from "./screens/call";
import { EventPage } from "./screens/event";
import { ExtrinsicPage } from "./screens/extrinsic";
import { HomePage } from "./screens/home";
import { NotFoundPage } from "./screens/notFound";
import { SearchPage } from "./screens/search";
import { RuntimePage } from "./screens/runtime";

import { config } from "./config";

export const router = createBrowserRouter([
	{
		id: "root",
		path: "/",
		loader: () => {
			const network = getNetwork("polkadot", false);

			return { network };
		},
		element: <ResultLayout />,
		children: [
			{
				index: true,
				element: <HomePage />
			},
			{
				path: "extrinsic/:id",
				element: <ExtrinsicPage />,
			},
			{
				path: "search",
				element: <SearchPage />,
			},
			{
				path: "block/:id",
				element: <BlockPage />,
			},
			{
				path: "call/:id",
				element: <CallPage />,
			},
			{
				path: "account/:address",
				element: <AccountPage />,
				loader: ({ params }) => {
					const { network: networkName, address } = params;
					const network = networkName ? getNetwork(networkName, false) : undefined;

					if (!network || !address) {
						return null;
					}

					const encodedAddress = encodeAddress(address, network.prefix);
					if (address !== encodedAddress) {
						return redirect(`/${network.name}/account/${encodedAddress}`);
					}

					return null;
				}
			},
			{
				path: "event/:id",
				element: <EventPage />,
			},
			{
				path: "latest-extrinsics",
				element: <Navigate to=".." replace />,
			},
			{
				path: "runtime",
				element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
			},
			{
				path: "runtime/:specVersion",
				element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
], {
	basename: window.location.hostname === "localhost"
		? undefined
		: process.env.PUBLIC_URL
});
