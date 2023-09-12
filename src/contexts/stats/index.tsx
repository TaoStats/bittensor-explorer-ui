import React, { useReducer, useContext, useEffect } from "react";
import {
	getChainStats,
	getTokenomics,
} from "../../services/statsService";
import { ChainStats, Tokenomics } from "../../model/stats";
import { useApi } from "../api";
import Decimal from "decimal.js";

///
// Initial state for `useReducer`

type State = {
	tokenLoading: boolean;
	tokenStats?: Tokenomics;
	chainLoading: boolean;
	chainStats?: ChainStats;
	delegatedSupplyLoading: boolean;
	delegatedSupply?: Decimal;
};

const initialState: State = {
	tokenLoading: true,
	chainLoading: true,
	delegatedSupplyLoading: true,
};

///
// Reducer function for `useReducer`

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case "TOKEN_FETCHED":
			return {
				...state,
				tokenLoading: false,
				tokenStats: action.payload,
			};
		case "CHAIN_FETCHED":
			return {
				...state,
				chainLoading: false,
				chainStats: action.payload,
			};
		case "DELEGATED_SUPPLY_FETCHED":
			return {
				...state,
				delegatedSupplyLoading: false,
				delegatedSupply: action.payload,
			};
		default:
			throw new Error(`Unknown type: ${action.type}`);
	}
};

const updateTokenStats = async (state: any, dispatch: any) => {
	const token = await getTokenomics();
	dispatch({ type: "TOKEN_FETCHED", payload: token });
};

const updateChainStats = async (state: any, dispatch: any) => {
	const chain = await getChainStats();
	dispatch({ type: "CHAIN_FETCHED", payload: chain });
};

const updateDelegatedSupply = async (state: any, dispatch: any, api: any) => {
	if (!api || !api.isReady) return;

	const res_bytes = await api.rpc.delegateInfo.getDelegates();
	if (res_bytes.isEmpty) {
		console.log("Failed to get delegates");
		dispatch({ type: "DELEGATED_SUPPLY_FETCHED" });
		return;
	}

	const res = api.createType("Vec<DelegateInfo>", res_bytes);
	const data = res.toJSON();

	const sum = data.reduce(
		(sum: number, current: any) =>
			sum + current.nominators.reduce((total: number, item: any) => total + item[1], 0),
		0
	);

	dispatch({ type: "DELEGATED_SUPPLY_FETCHED", payload: sum });
};

const defaultValue = {
	state: initialState,
};

const StatsContext = React.createContext(defaultValue);

const StatsContextProvider = (props: any) => {
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const { state: { api } } = useApi();

	useEffect(() => {
		updateTokenStats(state, dispatch);
		const id = setInterval(() => {
			updateTokenStats(state, dispatch);
		}, 5 * 60 * 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		updateChainStats(state, dispatch);
		const id = setInterval(() => {
			updateChainStats(state, dispatch);
		}, 12 * 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		updateDelegatedSupply(state, dispatch, api);
		const id = setInterval(() => {
			updateDelegatedSupply(state, dispatch, api);
		}, 60 * 1000);
		return () => clearInterval(id);
	}, []);

	return (
		<StatsContext.Provider value={{ state }}>
			{props.children}
		</StatsContext.Provider>
	);
};

const useAppStats = () => useContext(StatsContext);

export { StatsContextProvider, useAppStats };
