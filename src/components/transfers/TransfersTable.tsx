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
  width: 28px;
  text-align: center;
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
