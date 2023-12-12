import React, { useReducer, useContext } from "react";
import { rpc, types } from "../../chaintypes";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { RPC_ENDPOINT } from "../../config";

///
// Initial state for `useReducer`

type State = {
	socket: string;
	api: any;
	apiError: any;
	apiState: any;
};

const initialState: State = {
	// These are the states
	socket: RPC_ENDPOINT,
	api: null,
	apiError: null,
	apiState: null,
};

///
// Reducer function for `useReducer`

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case "CONNECT_INIT":
			return { ...state, apiState: "CONNECT_INIT" };
		case "CONNECT":
			return { ...state, api: action.payload, apiState: "CONNECTING" };
		case "CONNECT_SUCCESS":
			return { ...state, apiState: "READY" };
		case "CONNECT_ERROR":
			return { ...state, apiState: "ERROR", apiError: action.payload };
		case "LOAD_KEYRING":
			return { ...state, keyringState: "LOADING" };
		case "SET_KEYRING":
			return { ...state, keyring: action.payload, keyringState: "READY" };
		case "KEYRING_ERROR":
			return { ...state, keyring: null, keyringState: "ERROR" };
		case "SET_CURRENT_ACCOUNT":
			return { ...state, currentAccount: action.payload };
		case "SET_ACCOUNTS":
			return { ...state, accounts: action.payload };
		default:
			throw new Error(`Unknown type: ${action.type}`);
	}
};

///
// Connecting to the Substrate node

const connect = (state: any, dispatch: any) => {
	const { apiState, socket } = state;
	// We only want this function to be performed once
	if (apiState) return;

	dispatch({ type: "CONNECT_INIT" });

	const provider = new WsProvider(socket);
	const _api = new ApiPromise({ provider, rpc, types });

	// Set listeners for disconnection and reconnection event.
	_api.on("connected", () => {
		dispatch({ type: "CONNECT", payload: _api });
		// `ready` event is not emitted upon reconnection and is checked explicitly here.
		_api.isReady.then(() => dispatch({ type: "CONNECT_SUCCESS" }));
	});
	_api.on("ready", () => dispatch({ type: "CONNECT_SUCCESS" }));
	_api.on("error", (err) => dispatch({ type: "CONNECT_ERROR", payload: err }));
};

const defaultValue = {
	state: initialState,
};

const ApiContext = React.createContext(defaultValue);

const ApiContextProvider = (props: any) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	connect(state, dispatch);

	return (
		<ApiContext.Provider value={{ state }}>
			{props.children}
		</ApiContext.Provider>
	);
};

const useApi = () => useContext(ApiContext);

export { ApiContextProvider, useApi };
