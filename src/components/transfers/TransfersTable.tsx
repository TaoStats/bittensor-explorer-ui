/** @jsxImportSource @emotion/react */

import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NETWORK_CONFIG } from "../../config";
import { BlockTimestamp } from "../BlockTimestamp";
import { css, Theme } from "@mui/material";
import { SortDirection } from "../../model/sortDirection";
import {
	TransfersFilter,
	TransfersOrder,
} from "../../services/transfersService";
import { useEffect, useState } from "react";
import { SortOrder } from "../../model/sortOrder";
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
  width: 28px;
  text-align: center;
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
  width: 36px;
  text-align: center;
`;

export type TransfersTableProps = {
	transfers: PaginatedResource<Transfer>;
	showTime?: boolean;
	direction?: {
		show: boolean;
		source: string;
	};
	initialSortOrder?: string;
	onSortChange?: (orderBy: TransfersOrder) => void;
	initialSort?: string;
	onFilterChange?: (newFilter?: TransfersFilter) => void;
	initialFilter?: TransfersFilter;
	address?: string;
	download?: boolean;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

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

const filterMappings: TransfersFilter = {
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
			0,
		],
		operator: "greaterThan",
	},
};

function TransfersTable(props: TransfersTableProps) {
	const {
		transfers,
		showTime,
		direction,
		initialFilter,
		onFilterChange,
		address,
		download,
	} = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();
	const [filter, setFilter] = useState<TransfersFilter | undefined>();

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
				key: "from",
				displayLabel: "From"
			},
			{
				key: "to",
				displayLabel: "To"
			},
			{
				key: "direction",
				displayLabel: "Direction",
			},
			{
				key: "amount",
				displayLabel: "Amount",
			},
		];
		const data = [];
		if(!transfers.loading && !transfers.notFound && transfers.data !== undefined) {
			for(let i = 0; i < transfers.data.length; i ++) {
				const transfer = transfers.data[i]!;
				const createdAt = await fetchBlocktimestamp(transfer.blockNumber);
				const amount = formatCurrency(
					rawAmountToDecimal(transfer.amount.toString()),
					currency,
					{
						decimalPlaces: "optimal",
					}
				);
				data.push({
					height: transfer.blockNumber,
					createdAt,
					from: transfer.from,
					to: transfer.to,
					direction: transfer.from === address ? "Out" : "In",
					amount,
				});
			}
		}
		return {
			columns,
			data,
			filename: `transfer-${address}`,
		};
	};

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage="No transfers found"
			error={transfers.error}
			pagination={transfers.pagination}
			data-test="transfers-table"
			sort={sort}
			onSortChange={handleSortChange}
			filterMappings={filterMappings}
			filter={filter}
			onFilterChange={handleFilterChange}
			getExportCSV={download ? getExportCSV : undefined}
		>
			<TransfersTableAttribute
				label="Extrinsic"
				render={(transfer) =>
					transfer.extrinsicId && (
						<Link
							to={`/extrinsic/${transfer.blockNumber}-${transfer.extrinsicId}`}
						>{`${transfer.blockNumber}-${transfer.extrinsicId}`}</Link>
					)
				}
			/>
			<TransfersTableAttribute
				label="From"
				render={(transfer) => (
					<AccountAddress
						address={transfer.from}
						prefix={prefix}
						shorten
						link={
							direction?.show && transfer.to !== direction?.source
								? false
								: true
						}
						copyToClipboard="small"
					/>
				)}
			/>
			{direction?.show && (
				<TransfersTableAttribute
					label=""
					render={(transfer) => {
						const dir = transfer.from === direction?.source ? "out" : "in";
						return (
							<div css={dirContainer}>
								<div css={dir === "out" ? dirOut : dirIn}>{dir}</div>
							</div>
						);
					}}
				/>
			)}
			<TransfersTableAttribute
				label="To"
				render={(transfer) => (
					<AccountAddress
						address={transfer.to}
						prefix={prefix}
						shorten
						copyToClipboard="small"
						link={
							direction?.show && transfer.from !== direction?.source
								? false
								: true
						}
					/>
				)}
			/>
			<TransfersTableAttribute
				label="Amount"
				render={(transfer) => (
					<Currency
						amount={transfer.amount}
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
				sortable
				sortProperty="amount"
			/>
			{showTime && (
				<TransfersTableAttribute
					label="Time"
					colCss={{ width: 200 }}
					render={(transfer) => (
						<BlockTimestamp
							blockHeight={transfer.blockNumber}
							fromNow
							utc
							tooltip
						/>
					)}
					sortable
					sortProperty="time"
				/>
			)}
		</ItemsTable>
	);
}

export default TransfersTable;
