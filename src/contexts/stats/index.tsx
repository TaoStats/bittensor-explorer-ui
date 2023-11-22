import React, { useReducer, useContext, useEffect } from "react";
import { getTokenomics } from "../../services/statsService";
import { Tokenomics } from "../../model/stats";

///
// Initial state for `useReducer`

type State = {
	tokenLoading: boolean;
	tokenStats?: Tokenomics;
};

const initialState: State = {
	tokenLoading: true,
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
		default:
			throw new Error(`Unknown type: ${action.type}`);
	}
};

const updateTokenStats = async (state: any, dispatch: any) => {
	const token = await getTokenomics();
	dispatch({ type: "TOKEN_FETCHED", payload: token });
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

	return (
		<StatsContext.Provider value={{ state }}>
			{props.children}
		</StatsContext.Provider>
	);
};

const useAppStats = () => useContext(StatsContext);

export { StatsContextProvider, useAppStats };
