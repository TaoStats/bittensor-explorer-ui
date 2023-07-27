/** @jsxImportSource @emotion/react */

import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NETWORK_CONFIG } from "../../config";
import { BlockTimestamp } from "../BlockTimestamp";

export type TransfersTableProps = {
	transfers: PaginatedResource<Transfer>;
	showTime?: boolean;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

function TransfersTable(props: TransfersTableProps) {
	const { transfers, showTime } = props;

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
						copyToClipboard='small'
					/>
				)}
			/>
			<TransfersTableAttribute
				label='To'
				render={(transfer) => (
					<AccountAddress
						address={transfer.to}
						prefix={prefix}
						shorten
						copyToClipboard='small'
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
					render={(transfer) =>
						<BlockTimestamp blockHeight={transfer.blockNumber} fromNow utc tooltip />
					}
				/>
			)}
		</ItemsTable>
	);
}

export default TransfersTable;
