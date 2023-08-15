/** @jsxImportSource @emotion/react */
import { NETWORK_CONFIG } from "../../config";
import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type BalancesTableProps = {
	balances: PaginatedResource<Balance>;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance>;

function BalancesTable(props: BalancesTableProps) {
	const { balances } = props;

	return (
		<ItemsTable
			data={balances.data}
			additionalData={[]}
			loading={balances.loading}
			notFound={balances.notFound}
			notFoundMessage='No balances found'
			error={balances.error}
			pagination={balances.pagination}
			data-test='balances-table'
			showRank
		>
			<BalancesItemsTableAttribute
				label='Account'
				render={(balance) => (
					<AccountAddress
						address={decodeAddress(balance.address)}
						prefix={NETWORK_CONFIG.prefix}
						copyToClipboard='normal'
						shorten
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label='Free'
				render={(balance) => (
					<Currency
						amount={balance.free}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label='Delegated'
				render={(balance) => (
					<Currency
						amount={balance.staked}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label='Total'
				render={(balance) => (
					<Currency
						amount={balance.total}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label='Last update'
				render={(balance) => (
					<Link to={`/block/${balance.updatedAt.toString()}`}>
						{balance.updatedAt.toString()}
					</Link>
				)}
			/>
		</ItemsTable>
	);
}

export default BalancesTable;
