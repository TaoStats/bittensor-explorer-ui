/** @jsxImportSource @emotion/react */
import { css } from "@mui/material";

import { Theme } from "@emotion/react";
import { Pagination, usePagination } from "../hooks/usePagination";

const paginationStyle = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const showStyle = () => css`
  display: flex;
  gap: 10px;
`;

const showLabelStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  margin-right: 5px;
`;

const showItemStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  cursor: pointer;
`;

const showItemSelectedStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.light};
  cursor: pointer;
`;

const searchSpanStyle = () => css`
  margin-left: 15px;
`;

const searchStyle = (theme: Theme) => css`
  background-color: ${theme.palette.secondary.main};
  background-image: url(search.svg);
  background-position: 18px center;
  background-repeat: no-repeat;
  background-size: 16px;
  border: 0;
  border-radius: 3px;
  color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 5px 0 41px;
  width: 230px;
`;

type TablePaginationProps = Pagination;

export function TablePaginationHeader(props: TablePaginationProps) {
	const { limit, set: setPaginationOptions } = props;
	const { pageSizes } = usePagination();

	return (
		<div css={paginationStyle}>
			<div css={showStyle}>
				<label css={showLabelStyle}>Show</label>
				{pageSizes.map((size, index) => (
					<div
						css={size === limit ? showItemSelectedStyle : showItemStyle}
						key={index}
						onClick={() => setPaginationOptions({ ...props, offset: 0, limit: size })}
					>
						{size}
					</div>
				))}
			</div>
			<label>
				Search:
				<span css={searchSpanStyle}>
					<input
						type="search"
						css={searchStyle}
					/>
				</span>
			</label>
		</div>
	);
}
