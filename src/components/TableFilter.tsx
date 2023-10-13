/** @jsxImportSource @emotion/react */
import { css } from "@mui/material";

import { Theme } from "@emotion/react";
import { Pagination } from "../hooks/usePagination";

const filterStyle = () => css`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 0 0 20px;
  font-size: 14px;
`;

const filterLabelStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  margin-right: 5px;
`;

const filterItemStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  cursor: pointer;
`;

const filterItemSelectedStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.light};
  cursor: pointer;
  font-weight: bold;
`;

type TableFilterProps = {
	property: string;
	filter: any;
	value: any;
	onFilterChange?: (key: string, value: any) => void;
	pagination?: Pagination;
};

export function TableFilter(props: TableFilterProps) {
	const { property, filter, value, onFilterChange, pagination } = props;

	return (
		<div css={filterStyle}>
			<label css={filterLabelStyle}>{filter.key}</label>
			{filter.values.map((breakpoint: any, index: number) => (
				<div
					css={breakpoint === value ? filterItemSelectedStyle : filterItemStyle}
					key={index}
					onClick={() => {
						if (onFilterChange) onFilterChange(property, breakpoint);

						pagination?.set({
							...pagination,
							offset: 1,
							page: 1,
							prevEndCursor: [],
						});
					}}
				>
					{filter.labels[index]}
				</div>
			))}
		</div>
	);
}
