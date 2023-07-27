import { Network } from "../model/network";

import networks from "../networks.json";

export function getArchive(network: string) {
	return getNetwork(network).squids["archive"];
}

export function getBalancesSquid(network: string) {
	return getNetwork(network).squids["balances"];
}

export function getExplorerSquid(network: string) {
	return getNetwork(network).squids["explorer"];
}

export function getMainSquid(network: string) {
	return getNetwork(network).squids["main"];
}

export function getMainIdentitesSquid(network: string) {
	return getNetwork(network).squids["main-identites"];
}

export function getStatsSquid(network: string) {
	return getNetwork(network).squids["stats"];
}

export function getNetworks() {
	return networks as Network[];
}

export function getNetwork(name: string): Network;
export function getNetwork(name: string, throwIfNotFound: true): Network;
export function getNetwork(name: string, throwIfNotFound: false): Network|undefined;
export function getNetwork(name: string, throwIfNotFound = true) {
	const network = getNetworks().find((network) => network.name === name);

	if (!network && throwIfNotFound) {
		throw new Error(`Network '${name}' doesn't exist`);
	}

	return network;
}

export function hasSupport(network: string, feature: "archive"|"balances-squid"|"explorer-squid"|"main-squid"|"main-identities-squid"|"stats-squid") {
	switch(feature) {
		case "archive": return !!getArchive(network);
		case "balances-squid": return !!getBalancesSquid(network);
		case "explorer-squid": return !!getExplorerSquid(network);
		case "main-squid": return !!getMainSquid(network);
		case "main-identities-squid": return !!getMainIdentitesSquid(network);
		case "stats-squid": return !!getStatsSquid(network);
	}
}