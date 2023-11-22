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
import { TransfersOrder } from "../../services/transfersService";
import { useEffect, useState } from "react";
import { SortOrder } from "../../model/sortOrder";

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
	}
};

function TransfersTable(props: TransfersTableProps) {
	const { transfers, showTime, direction } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();

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
				direction: sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
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

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage='No transfers found'
			error={transfers.error}
			pagination={transfers.pagination}
			data-test='transfers-table'
			sort={sort}
			onSortChange={handleSortChange}
		>
			<TransfersTableAttribute
				label='Extrinsic'
				render={(transfer) =>
					transfer.extrinsicId && (
						<Link
							to={`/extrinsic/${transfer.blockNumber}-${transfer.extrinsicId}`}
						>{`${transfer.blockNumber}-${transfer.extrinsicId}`}</Link>
					)
				}
			/>
			<TransfersTableAttribute
				label='From'
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
						copyToClipboard='small'
					/>
				)}
			/>
			{direction?.show && (
				<TransfersTableAttribute
					label=''
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
				label='To'
				render={(transfer) => (
					<AccountAddress
						address={transfer.to}
						prefix={prefix}
						shorten
						copyToClipboard='small'
						link={
							direction?.show && transfer.from !== direction?.source
								? false
								: true
						}
					/>
				)}
			/>
			<TransfersTableAttribute
				label='Amount'
				render={(transfer) => (
					<Currency
						amount={transfer.amount}
						currency={currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
				sortable
				sortProperty='amount'
			/>
			{showTime && (
				<TransfersTableAttribute
					label='Time (UTC)'
					colCss={{ width: 200 }}
					render={(transfer) => (
						<BlockTimestamp
							blockHeight={transfer.blockNumber}
							utc
							tooltip
							timezone={false}
						/>
					)}
					sortable
					sortProperty='time'
				/>
			)}
		</ItemsTable>
	);
}

export default TransfersTable;
