import { createBrowserRouter, redirect } from "react-router-dom";

import { ResultLayout } from "./components/elements/ResultLayout";
import { encodeAddress } from "./utils/formatAddress";
import {
	AccountPage,
	BlockPage,
	ColdkeyPage,
	EventPage,
	ExtrinsicPage,
	HomePage,
	HotkeyPage,
	NotFoundPage,
	RootSubnetPage,
	SearchPage,
	StakingPage,
	SubnetPage,
	SubnetsPage,
	TokenomicsPage,
	ValidatorPage,
	ValidatorsPage,
} from "./screens";
import { NETWORK_CONFIG } from "./config";

export const router = createBrowserRouter(
	[
		{
			element: <ResultLayout />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: "extrinsic/:query",
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
					path: "account/:address",
					element: <AccountPage />,
					loader: ({ params }) => {
						const { address } = params;

						if (!address) {
							return null;
						}

						const encodedAddress = encodeAddress(
							address,
							NETWORK_CONFIG.prefix
						);
						if (address !== encodedAddress) {
							return redirect(`/account/${encodedAddress}`);
						}

						return null;
					},
				},
				{
					path: "event/:id",
					element: <EventPage />,
				},
				{
					path: "validator/:address",
					element: <ValidatorPage />,
				},
				{
					path: "validators",
					element: <ValidatorsPage />,
				},
				{
					path: "subnets",
					element: <SubnetsPage />,
				},
				{
					path: "subnet/0",
					element: <RootSubnetPage />,
				},
				{
					path: "subnet/:id",
					element: <SubnetPage />,
				},
				{
					path: "coldkey/:coldkey",
					element: <ColdkeyPage />,
				},
				{
					path: "hotkey/:hkey",
					element: <HotkeyPage />,
				},
				{
					path: "tokenomics",
					element: <TokenomicsPage />,
				},
				{
					path: "staking",
					element: <StakingPage />,
				},
				{
					path: "*",
					element: <NotFoundPage />,
				},
			],
		},
	],
	{
		basename:
			window.location.hostname === "localhost"
				? undefined
				: process.env.PUBLIC_URL,
	}
);
