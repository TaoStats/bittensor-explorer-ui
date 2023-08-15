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

const dirIn = (theme: Theme) => css`
  color: ${theme.palette.success.main};
  text-transform: uppercase;
`;

const dirOut = (theme: Theme) => css`
  color: ${theme.palette.neutral.main};
  text-transform: uppercase;
`;

export type TransfersTableProps = {
	transfers: PaginatedResource<Transfer>;
	showTime?: boolean;
	direction?: {
		show: boolean;
		source: string;
	};
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

function TransfersTable(props: TransfersTableProps) {
	const { transfers, showTime, direction } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage='No transfers found'
			error={transfers.error}
			pagination={transfers.pagination}
			data-test='transfers-table'
		>
			<TransfersTableAttribute
				label='Extrinsic'
				render={(transfer) =>
					transfer.extrinsicId && (
						<Link to={`/extrinsic/${transfer.id}`}>{transfer.id}</Link>
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
						return <div css={dir === "out" ? dirOut : dirIn}>{dir}</div>;
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
			/>
			{showTime && (
				<TransfersTableAttribute
					label='Time'
					colCss={{ width: 200 }}
					render={(transfer) => (
						<BlockTimestamp
							blockHeight={transfer.blockNumber}
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

export default TransfersTable;
