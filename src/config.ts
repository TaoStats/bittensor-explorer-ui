require("dotenv").config();

const buildTimeEnv = process.env;
const runtimeEnv = window.env;

export const config = {
	rollbar: {
		enabled: runtimeEnv.REACT_APP_ROLLBAR_ENABLED === "true",
		environment: runtimeEnv.REACT_APP_ROLLBAR_ENV,
		accessToken: buildTimeEnv.REACT_APP_ROLLBAR_TOKEN,
	},
	app: {
		commitSha: buildTimeEnv.REACT_APP_COMMIT_SHA,
		buildTimestamp: buildTimeEnv.REACT_APP_BUILD_TIMESTAMP,
		publishTimestamp: runtimeEnv.REACT_APP_PUBLISH_TIMESTAMP,
	},
	devtools: {
		enabled: localStorage.getItem("devtools") === "1",
	},
};

export const DICTIONARY_ENDPOINT = process.env.REACT_APP_DICTIONARY_ENDPOINT || "";
export const INDEXER_ENDPOINT = process.env.REACT_APP_INDEXER_ENDPOINT || "";
export const HISTORICAL_ENDPOINT = process.env.REACT_APP_HISTORICAL_ENDPOINT || "";
export const SUBNETS_ENDPOINT = process.env.REACT_APP_SUBNETS_ENDPOINT || "";
export const TAOSTATS_DATA_ENDPOINT = process.env.REACT_APP_TAOSTATS_DATA_ENDPOINT || "";
export const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT || "";

export const NETWORK_CONFIG = {
	currency: "𝞃",
	decimals: 9,
	prefix: 42,
};

export const MIN_DELEGATION_AMOUNT = 1000000;
