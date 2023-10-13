/** @jsxImportSource @emotion/react */
import { Theme, css } from "@mui/material";

import { Pagination } from "../hooks/usePagination";
import { theme } from "../theme";
import { formatNumber } from "../utils/number";

const paginationStyle = css`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 0 0 10px;
  font-size: 14px;
  @media (max-width: 999px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const pagesStyle = css`
  display: flex;
  gap: 3px;
`;

const disabledPageStyle = css`
  color: ${theme.palette.secondary.main};
  padding: 0 10px;
`;

const activePageStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.light};
  padding: 0 3px;
`;

const pageStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  cursor: pointer;
  padding: 0 10px;

  &:hover {
    color: ${theme.palette.secondary.light};
  }
`;

type TablePaginationProps = Pagination;

type PageProps = {
	page: number;
};

type PageNavProps = {
	disabled: boolean;
};

export function TablePagination(props: TablePaginationProps) {
	const {
		hasNextPage,
		hasPreviousPage,
		limit,
		offset,
		page,
		setNextPage,
		setPreviousPage,
		totalCount,
	} = props;

	const Page = ({ page }: PageProps) => {
		return (
			<div key={page} css={activePageStyle}>
				{page}
			</div>
		);
	};

	const PrevPage = ({ disabled }: PageNavProps) => {
		return (
			<div
				css={disabled ? disabledPageStyle : pageStyle}
				onClick={() => !disabled && setPreviousPage()}
			>
        Previous
			</div>
		);
	};

	const NextPage = ({ disabled }: PageNavProps) => {
		return (
			<div
				css={disabled ? disabledPageStyle : pageStyle}
				onClick={() => !disabled && setNextPage()}
			>
        Next
			</div>
		);
	};

	const startOffset = Math.min(offset, totalCount ?? 0);
	const endOffset = Math.min(offset + limit - 1, totalCount ?? 0);

	return (
		<div css={paginationStyle}>
			<div css={disabledPageStyle}>
        Showing {formatNumber(startOffset)} to {formatNumber(endOffset)} of{" "}
				{formatNumber(totalCount ?? 0)} entries
			</div>
			<div css={pagesStyle}>
				<PrevPage disabled={!hasPreviousPage} />
				<Page page={page} />
				<NextPage disabled={!hasNextPage} />
			</div>
		</div>
	);
}
