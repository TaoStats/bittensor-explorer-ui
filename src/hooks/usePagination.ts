import { useCallback, useMemo, useState } from "react";

export type PaginationState = {
	endCursor: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	limit: number;
	offset: number;
	page: number;
	prevEndCursor: string[];
	prevPage: number;
	pageNumbers: boolean;
	totalCount?: number;
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

export function usePagination(limit = 10, pageNumbers = false) {
	const pageSizes = [10, 25, 50, 100];
	const [state, setState] = useState<PaginationState>({
		endCursor: "",
		hasNextPage: false,
		hasPreviousPage: false,
		limit: limit,
		offset: 1,
		page: 1,
		prevEndCursor: [],
		prevPage: 1,
		pageNumbers: pageNumbers,
		totalCount: 0,
	});

	const setPreviousPage = useCallback(() => {
		if (state.pageNumbers ? state.page === 1 : !state.hasPreviousPage) {
			return;
		}
		setState({
			...state,
			offset: state.offset - state.limit,
			page: state.page - 1,
			prevEndCursor: state.prevEndCursor.slice(0, -1),
			prevPage: state.page,
		});
	}, [state]);

	const setNextPage = useCallback(() => {
		const maxPage = Math.ceil((state.totalCount ?? 1) / state.limit);
		if (state.pageNumbers ? state.page === maxPage : !state.hasNextPage) {
			return;
		}
		setState({
			...state,
			offset: state.offset + state.limit,
			page: state.page + 1,
			prevEndCursor: [...state.prevEndCursor, state.endCursor],
			prevPage: state.page,
		});
	}, [state]);

	const setPage = useCallback(
		(page: number) => {
			setState({
				...state,
				offset: state.limit * (page - 1) + 1,
				page: page,
			});
		},
		[state]
	);

	const set = useCallback(
		(newState: Partial<Pagination>) => {
			if (newState.totalCount === undefined) delete newState.totalCount;
			setState({
				...state,
				...newState,
			});
		},
		[state]
	);

	return useMemo(
		() =>
			({
				...state,
				pageSizes,
				set,
				setPreviousPage,
				setNextPage,
				setPage,
			} as Pagination),
		[state, setPreviousPage, setNextPage, setState]
	);
}
