/** @jsxImportSource @emotion/react */
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { css, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { Theme } from "@emotion/react";
import { Pagination, usePagination } from "../hooks/usePagination";
import { useState } from "react";

const paginationStyle = css`
	display: flex;
	justify-content: right;
	margin-top: 16px;
`;

const buttonStyle = (theme: Theme) => css`
	padding: 4px;

	border-radius: 4px;
	color: ${theme.palette.primary.main};
	background-color: ${theme.palette.success.main};

	margin-left: 8px;

	&:hover {
		background-color: ${theme.palette.success.light};
	}

	&.Mui-disabled {
		color: ${theme.palette.primary.dark};
		background-color: ${theme.palette.text.secondary};
	}
`;

const pageOptions = (theme: Theme) => css`
	background-color: ${theme.palette.secondary.dark};
`;

export type TablePaginationProps = Pagination;

export function TablePagination(props: TablePaginationProps) {
	const {
		offset,
		limit,
		hasNextPage = true,
		setPreviousPage,
		setNextPage,
		set: setPaginationOptions,
	} = props;
	const { pageSizes } = usePagination();

	const onPageSizeChange = (e: SelectChangeEvent<number>) => { 
		const size = e.target.value as number;
		setPaginationOptions({...props, limit: size});
	};

	return (
		<div css={paginationStyle}>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				sx={{ height: "32px", ml: "8px" }}
				css={pageOptions}
				value={limit}
				onChange={onPageSizeChange}
			>
				{pageSizes.map((size, index) => (
					<MenuItem value={size} key={index}>{size}</MenuItem>
				))}
			</Select>
			<IconButton
				css={buttonStyle}
				disabled={offset === 0}
				onClick={() => setPreviousPage()}
			>
				<ChevronLeft />
			</IconButton>
			<IconButton
				css={buttonStyle}
				disabled={!hasNextPage}
				onClick={() => setNextPage()}
			>
				<ChevronRight />
			</IconButton>
		</div>
	);
}
