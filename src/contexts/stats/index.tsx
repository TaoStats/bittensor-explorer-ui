import React, { useReducer, useContext, useEffect } from "react";
import { getChainStats, getTokenomics } from "../../services/statsService";
import { ChainStats, Tokenomics } from "../../model/stats";
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

const defaultValue = {
	state: initialState,
};

const StatsContext = React.createContext(defaultValue);

const StatsContextProvider = (props: any) => {
	const [state, dispatch] = useReducer(reducer, initialState);

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
	return (
		<StatsContext.Provider value={{ state }}>
			{props.children}
		</StatsContext.Provider>
	);
};

const useAppStats = () => useContext(StatsContext);

export { StatsContextProvider, useAppStats };
