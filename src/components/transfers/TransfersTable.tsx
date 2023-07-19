import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";
import { NETWORK_CONFIG } from "../../config";

export type TransfersTableProps = {
	transfers: PaginatedResource<Transfer>,
	showTime?: boolean;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

function TransfersTable(props: TransfersTableProps) {
	const {
		transfers,
		showTime,
	} = props;

	const { currency } = NETWORK_CONFIG;

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
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				}
			/>
			<TransfersTableAttribute
				label="Success"
				colCss={{width: 180}}
				render={(transfer) =>
					<Chip
						variant="outlined"
						icon={<img src={transfer.success ? CheckIcon : CrossIcon}  />}
						label={transfer.success ? "Success" : "Fail"}
					/>
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
