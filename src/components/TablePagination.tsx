/** @jsxImportSource @emotion/react */
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { css, IconButton } from "@mui/material";

import { Theme } from "@emotion/react";

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

export type TablePaginationProps = {
	offset: number;
	limit: number;
	hasNextPage?: boolean;
	hideOnSinglePage?: boolean;
	setPreviousPage: () => void;
	setNextPage: () => void;
};

export function TablePagination(props: TablePaginationProps) {
	const {
		offset,
		hasNextPage = true,
		hideOnSinglePage = true,
		setPreviousPage,
		setNextPage,
	} = props;

	if (hideOnSinglePage && offset === 0 && !hasNextPage) {
		return null;
	}

	return (
		<div css={paginationStyle}>
			<IconButton css={buttonStyle} disabled={offset === 0} onClick={() => setPreviousPage()}>
				<ChevronLeft />
			</IconButton>
			<IconButton css={buttonStyle} disabled={!hasNextPage} onClick={() => setNextPage()}>
				<ChevronRight />
			</IconButton>
		</div>
	);
}
