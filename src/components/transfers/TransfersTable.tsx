/** @jsxImportSource @emotion/react */
import { css, Theme } from "@mui/material";

import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";
import { getNetwork } from "../../services/networksService";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type TransfersTableProps = {
	network: string;
	transfers: PaginatedResource<Transfer>,
	showTime?: boolean;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

const successStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.error.main};
`;

function TransfersTable(props: TransfersTableProps) {
	const {
		network,
		transfers,
		showTime,
	} = props;

	console.log(transfers);

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage="No transfers found"
			error={transfers.error}
			pagination={transfers.pagination}
			data-test="transfers-table"
		>
			<TransfersTableAttribute
				label="Extrinsic"
				render={(transfer) => transfer.extrinsic &&
					<Link to={`/extrinsic/${transfer.extrinsic.id}`}>
						{transfer.extrinsic.id}
					</Link>
				}
			/>
			<TransfersTableAttribute
				label="From"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.fromPublicKey}
						prefix={transfer.runtimeSpec.metadata.ss58Prefix}
						shorten
						copyToClipboard="small"
					/>
				}
			/>
			<TransfersTableAttribute
				label="To"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.toPublicKey}
						prefix={transfer.runtimeSpec.metadata.ss58Prefix}
						shorten
						copyToClipboard="small"
					/>
				}
			/>
			<TransfersTableAttribute
				label="Amount"
				render={(transfer) =>
					<Currency
						amount={transfer.amount}
						currency={getNetwork(network).symbol}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				}
			/>
			<TransfersTableAttribute
				label="Success"
				colCss={{width: 180}}
				render={(transfer) =>
					<>
						{
							transfer.success ?
								<span css={successStyle}>&#x1F5F9;</span> :
								<span css={failedStyle}>&#x1F5F5;</span>
						}
					</>
				}
			/>
			{showTime &&
				<TransfersTableAttribute
					label="Time"
					colCss={{width: 200}}
					render={(transfer) =>
						<Time time={transfer.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default TransfersTable;
