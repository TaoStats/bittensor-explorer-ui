/** @jsxImportSource @emotion/react */

import { PaginatedResource } from "../../model/paginatedResource";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { MIN_DELEGATION_AMOUNT, NETWORK_CONFIG } from "../../config";
import { BlockTimestamp } from "../BlockTimestamp";
import { css, Theme } from "@mui/material";
import { SortDirection } from "../../model/sortDirection";
import { useEffect, useState } from "react";
import { SortOrder } from "../../model/sortOrder";
import { DelegateFilter, DelegatesOrder } from "../../services/delegateService";
import { Delegate } from "../../model/delegate";
import { formatCurrency, rawAmountToDecimal, rawAmountToDecimaledString } from "../../utils/number";
import { fetchBlocktimestamp } from "../../utils/block";

const dirContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const dirIn = (theme: Theme) => css`
  background-color: rgba(255, 153, 0, 0.8);
  text-transform: uppercase;
  display: inline-block;
  color: #141414;
  padding: 0px 4px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  border: 2px solid ${theme.palette.neutral.main};
  text-align: center;
  width: 90px;
`;

const dirOut = (theme: Theme) => css`
  background-color: rgb(20, 222, 194, 0.8);
  text-transform: uppercase;
  display: inline-block;
  color: #141414;
  font-size: 10px;
  padding: 0 4px;
  border: 2px solid ${theme.palette.success.main};
  font-weight: 400;
  border-radius: 4px;
  text-align: center;
  width: 90px;
`;

export type DelegatesTableProps = {
	delegates: PaginatedResource<Delegate>;
	showTime?: boolean;
	initialSortOrder?: string;
	onSortChange?: (orderBy: DelegatesOrder) => void;
	initialSort?: string;
	onFilterChange?: (newFilter?: DelegateFilter) => void;
	initialFilter?: DelegateFilter;
	onSearchChange?: (newSearch?: string) => void;
	initialSearch?: string;
	address?: string;
	download?: boolean;
};

const DelegatesTableAttribute = ItemsTableAttribute<Delegate>;

const orderMappings = {
	amount: {
		[SortDirection.ASC]: "AMOUNT_ASC",
		[SortDirection.DESC]: "AMOUNT_DESC",
	},
	time: {
		[SortDirection.ASC]: "BLOCK_NUMBER_ASC",
		[SortDirection.DESC]: "BLOCK_NUMBER_DESC",
	},
};

const filterMappings: DelegateFilter = {
	amount: {
		key: "Amount >",
		labels: ["100k", "50k", "10k", "5k", "1k", "500", "100", "..."],
		values: [
			rawAmountToDecimaledString(100000),
			rawAmountToDecimaledString(50000),
			rawAmountToDecimaledString(10000),
			rawAmountToDecimaledString(5000),
			rawAmountToDecimaledString(1000),
			rawAmountToDecimaledString(500),
			rawAmountToDecimaledString(100),
			MIN_DELEGATION_AMOUNT,
		],
		operator: "greaterThan",
	},
};

function DelegatesTable(props: DelegatesTableProps) {
	const {
		delegates,
		showTime,
		initialFilter,
		onFilterChange,
		initialSearch,
		onSearchChange,
		address,
		download,
	} = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();
	const [filter, setFilter] = useState<DelegateFilter | undefined>();
	const [search, setSearch] = useState(initialSearch);

	useEffect(() => {
		Object.entries(orderMappings).forEach(([property, value]) => {
			Object.entries(value).forEach(([dir, orderKey]) => {
				if (orderKey === initialSort) {
					setSort({
						property,
						direction: dir === "1" ? SortDirection.ASC : SortDirection.DESC,
					});
				}
			});
		});
	}, [initialSort]);

	const handleSortChange = (property?: string) => {
		if (!property) return;
		if (property === sort?.property) {
			setSort({
				...sort,
				direction:
					sort.direction === SortDirection.ASC
						? SortDirection.DESC
						: SortDirection.ASC,
			});
		} else {
			setSort({
				property,
				direction: SortDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!onSortChange || !sort?.property || sort.direction === undefined)
			return;
		onSortChange((orderMappings as any)[sort.property][sort.direction]);
	}, [JSON.stringify(sort)]);

	useEffect(() => {
		Object.entries(filterMappings).forEach(([property, mapping]) => {
			mapping.values.forEach((value: number) => {
				if (value === initialFilter?.[property]?.[mapping.operator]) {
					setFilter({
						...filter,
						[property]: {
							[mapping.operator]: value,
						},
					});
				}
			});
		});
	}, [JSON.stringify(initialFilter)]);
	const handleFilterChange = (key: string, value: number) => {
		setFilter({
			...filter,
			[key]: {
				[filterMappings[key].operator]: value,
			},
		});
	};

	useEffect(() => {
		if (!onFilterChange) return;
		onFilterChange(filter);
	}, [JSON.stringify(filter)]);

	const handleSearchChange = (value?: string) => {
		setSearch(value);
	};

	useEffect(() => {
		if (!onSearchChange) return;
		onSearchChange(search);
	}, [search]);

	const getExportCSV = async () => {
		const columns = [
			{
				key: "height",
				displayLabel: "Block height"
			},
			{
				key: "createdAt",
				displayLabel: "Time(UTC)"
			},
			{
				key: "validator",
				displayLabel: "Validator"
			},
			{
				key: "amount",
				displayLabel: "Amount",
			},
		];
		const data = [];
		if(!delegates.loading && !delegates.notFound && delegates.data !== undefined) {
			for(let i = 0; i < delegates.data.length; i ++) {
				const delegate = delegates.data[i]!;
				const createdAt = await fetchBlocktimestamp(delegate.blockNumber);
				const amount = formatCurrency(
					rawAmountToDecimal(delegate.amount.toString()),
					currency,
					{
						decimalPlaces: "optimal",
					}
				);
				data.push({
					height: delegate.blockNumber,
					createdAt,
					validator: delegate.delegateName ?? delegate.delegate,
					amount,
				});
			}
		}
		return {
			columns,
			data,
			filename: `delegation-${address}`,
		};
	};

	return (
		<ItemsTable
			data={delegates.data}
			loading={delegates.loading}
			notFound={delegates.notFound}
			notFoundMessage="No delegate/undelegate events found"
			error={delegates.error}
			pagination={delegates.pagination}
			data-test="delegates-table"
			sort={sort}
			onSortChange={handleSortChange}
			filterMappings={filterMappings}
			filter={filter}
			onFilterChange={handleFilterChange}
			search={search}
			onSearchChange={handleSearchChange}
			searchPlaceholder="DELEGATE"
			getExportCSV={download ? getExportCSV : undefined}
		>
			<DelegatesTableAttribute
				label="Extrinsic"
				render={(delegate) =>
					delegate.extrinsicId && (
						<Link
							to={`/extrinsic/${delegate.blockNumber}-${delegate.extrinsicId}`}
						>{`${delegate.blockNumber}-${delegate.extrinsicId}`}</Link>
					)
				}
			/>
			<DelegatesTableAttribute
				label="Account"
				render={(delegate) => (
					<AccountAddress
						address={delegate.account}
						prefix={prefix}
						shorten
						link
						copyToClipboard="small"
					/>
				)}
			/>
			<DelegatesTableAttribute
				label=""
				render={({ action }) => (
					<div css={dirContainer}>
						<div css={action === "UNDELEGATE" ? dirIn : dirOut}>{action}</div>
					</div>
				)}
			/>
			<DelegatesTableAttribute
				label="Delegate"
				render={({ delegate, delegateName }) =>
					delegateName !== undefined ? (
						<Link to={`/validators/${delegate}`}>{delegateName}</Link>
					) : (
						<AccountAddress
							address={delegate}
							prefix={prefix}
							link={false}
							shorten
							copyToClipboard="small"
						/>
					)
				}
			/>
			<DelegatesTableAttribute
				label="Amount"
				render={(delegate) => (
					<Currency
						amount={delegate.amount}
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
				sortable
				sortProperty="amount"
			/>
			{showTime && (
				<DelegatesTableAttribute
					label="Time"
					colCss={{ width: 200 }}
					sortable
					sortProperty="time"
					render={(delegate) => (
						<BlockTimestamp
							blockHeight={delegate.blockNumber}
							fromNow
							utc
							tooltip
						/>
					)}
				/>
			)}
		</ItemsTable>
	);
}

export default DelegatesTable;
