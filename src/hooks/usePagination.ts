import { useCallback, useMemo, useState } from "react";

export type PaginationState = {
	limit: number;
	offset: number;
	hasNextPage: boolean;
	totalCount?: number
};

export type Pagination = PaginationState & {
	set: (pagination: Partial<PaginationState>) => void;
	setPreviousPage: () => void;
	setNextPage: () => void;
	setPage: (page: number) => void;
	pageSizes: number[];
};

export type UsePaginationProps = {
	limit?: number;
};

export function usePagination(limit = 10) {
	const pageSizes = [10, 25, 50, 100];
	const [state, setState] = useState<PaginationState>({
		limit,
		offset: 0,
		hasNextPage: false,
	});

	const setPreviousPage = useCallback(() => {
		if (state.offset === 0) {
			return;
		}
		setState({
			...state,
			offset: state.offset - state.limit,
		});
	}, [state]);

	const setNextPage = useCallback(() => {
		setState({
			...state,
			offset: state.offset + state.limit,
		});
	}, [state]);

	const setPage = useCallback((page: number) => {
		setState({
			...state,
			offset: state.limit * (page - 1),
		});
	}, [state]);

	const set = useCallback((newState: Partial<Pagination>) => {
		setState({
			...state,
			...newState
		});
	}, [state]);

	return useMemo(
		() => ({
			...state,
			pageSizes,
			set,
			setPreviousPage,
			setNextPage,
			setPage,
		} as Pagination),
		[state, setPreviousPage, setNextPage, setPage, setState]
	);
}
