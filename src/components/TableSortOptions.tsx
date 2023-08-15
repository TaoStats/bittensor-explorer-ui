/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Menu, MenuItem } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";

import { SortDirection } from "../model/sortDirection";
import { SortOrder } from "../model/sortOrder";

import { Ascending, Descending, Unsorted } from "./sortIcons";
import { TableColumnButton } from "./TableColumnButton";

const sortOptionsStyle = css`
	.MuiListSubheader-root {
		line-height: 26px;
	}

	.MuiSvgIcon-root {
		position: relative;
		left: -6px;
		font-size: 18px;
		opacity: .75;
		margin-right: 4px;
	}
`;

export type TableSortOptionsProps<T> = {
	options: {value: SortOrder<T>, label: ReactNode}[];
	value?: SortOrder<T>;
	onChange?: (value: SortOrder<T>) => void
}

export const TableSortOptions = <T = any>(props: TableSortOptionsProps<T>) => {
	const {options, value, onChange} = props;

	const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
	const handleSortClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, []);

	const handleSortSelected = useCallback((value: SortOrder<T>) => {
		onChange?.(value);
		setAnchorEl(null);
	}, [onChange]);

	const selectedOption = options.find(it => it.value.property === value?.property && it.value.direction === value?.direction);

	return (
		<>
			<TableColumnButton
				icon={
					selectedOption && selectedOption.value.direction === SortDirection.ASC ? <Ascending />
						: selectedOption && selectedOption.value.direction === SortDirection.DESC ? <Descending />
							: <Unsorted />
				}
				color={selectedOption && "secondary"}
				onClick={handleSortClick}
			>
				{selectedOption?.label}
			</TableColumnButton>
		</>
	);
};
