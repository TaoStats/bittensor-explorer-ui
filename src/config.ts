require("dotenv").config();

const buildTimeEnv = process.env;
const runtimeEnv = window.env;

export const config = {
	rollbar: {
		enabled: runtimeEnv.REACT_APP_ROLLBAR_ENABLED === "true",
		environment: runtimeEnv.REACT_APP_ROLLBAR_ENV,
		accessToken: buildTimeEnv.REACT_APP_ROLLBAR_TOKEN
	},
	app: {
		commitSha: buildTimeEnv.REACT_APP_COMMIT_SHA,
		buildTimestamp: buildTimeEnv.REACT_APP_BUILD_TIMESTAMP,
		publishTimestamp: runtimeEnv.REACT_APP_PUBLISH_TIMESTAMP
	},
	devtools: {
		enabled: localStorage.getItem("devtools") === "1"
	}
};

export const DICTIONARY_ENDPOINT = process.env.REACT_APP_DICTIONARY_ENDPOINT || "https://api.subquery.network/sq/TaoStats/bittensor-dictionary";
export const INDEXER_ENDPOINT = process.env.REACT_APP_INDEXER_ENDPOINT || "https://api.subquery.network/sq/TaoStats/bittensor-indexer";
export const TAOSTATS_DATA_ENDPOINT = process.env.REACT_APP_TAOSTATS_DATA_ENDPOINT || "https://taostats.io/data.json";
export const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT || "wss://entrypoint-finney.opentensor.ai:443";

export const NETWORK_CONFIG = {
	currency: "𝞃",
	decimals: 9,
	prefix: 42,
};

export const MIN_DELEGATION_AMOUNT = 1000000;