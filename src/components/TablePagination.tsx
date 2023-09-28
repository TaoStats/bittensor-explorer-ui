/** @jsxImportSource @emotion/react */
import { Theme, css } from "@mui/material";

import { Pagination } from "../hooks/usePagination";
import { theme } from "../theme";

const paginationStyle = css`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
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
  cursor: pointer;
  padding: 0 3px;
`;

const pageStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  cursor: pointer;
  padding: 0 3px;

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
	const { offset, limit, totalCount, setPreviousPage, setNextPage, setPage } =
    props;

	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.max(Math.ceil((totalCount ?? 0) / limit), 1);

	// Calculate the range of pages to display
	let startPage = Math.max(1, currentPage - 1);
	let endPage = Math.min(totalPages, currentPage + 1);

	// Ensure start and end pages
	if (totalPages > 7) {
		if (startPage < 4) {
			startPage = 1;
			endPage = Math.min(5, totalPages);
		}
		if (endPage > totalPages - 3) {
			startPage = Math.max(1, totalPages - 4);
			endPage = totalPages;
		}
	} else {
		startPage = 1;
		endPage = totalPages;
	}

	const pageNumbers = Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index
	);

	const Page = ({ page }: PageProps) => {
		return (
			<div
				key={page}
				css={currentPage === page ? activePageStyle : pageStyle}
				onClick={() => setPage(page)}
			>
				{page}
			</div>
		);
	};

	const DisabledPage = () => {
		return <div css={disabledPageStyle}>...</div>;
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

	return (
		<div css={paginationStyle}>
			<div css={disabledPageStyle}>
				Showing {Math.min(offset + 1, totalCount ?? 0)} to {Math.min(offset + limit, totalCount ?? 0)} of {totalCount ?? 0} entries
			</div>
			<div css={pagesStyle}>
				<PrevPage disabled={currentPage == 1} />
				{startPage > 1 && (
					<>
						<Page page={1} />
						<DisabledPage />
					</>
				)}
				{pageNumbers.map((page) => (
					<Page page={page} />
				))}
				{endPage < totalPages && (
					<>
						<DisabledPage />
						<Page page={totalPages} />
					</>
				)}
				<NextPage disabled={currentPage >= totalPages} />
			</div>
		</div>
	);
}
