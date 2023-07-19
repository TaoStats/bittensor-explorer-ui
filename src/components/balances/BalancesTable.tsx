import Decimal from "decimal.js";
import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { Resource } from "../../model/resource";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NETWORK_CONFIG } from "../../config";

export type BalancesTableProps = {
	balances: PaginatedResource<Balance>;
	usdRate: Resource<Decimal>;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance, never, [Decimal]>;

function BalancesTable(props: BalancesTableProps) {
	const { balances, usdRate } = props;
	const { currency } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={balances.data}
			additionalData={[usdRate.data]}
			loading={balances.loading || usdRate.loading}
			notFound={balances.notFound}
			notFoundMessage="No balances found"
			error={balances.error}
			pagination={balances.pagination}
			data-test="balances-table"
		>
			<BalancesItemsTableAttribute
				label="Account"
				render={(balance) =>
					<AccountAddress
						address={decodeAddress(balance.id)}
						prefix={balance.runtimeSpec.metadata.ss58Prefix}
						shorten
						copyToClipboard="small"
					/>}
			/>

			<BalancesItemsTableAttribute
				label="Total"
				render={(balance, usdRate) =>
					<Currency
						amount={balance.total}
						currency={currency}
						decimalPlaces="optimal"
						usdRate={usdRate}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Free"
				render={(balance, usdRate) =>
					<Currency
						amount={balance.free}
						currency={currency}
						decimalPlaces="optimal"
						usdRate={usdRate}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Reserved"
				render={(balance, usdRate) =>
					<Currency
						amount={balance.reserved}
						currency={currency}
						decimalPlaces="optimal"
						usdRate={usdRate}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Last update"
				render={(balance) =>
					<Link to={`/search?query=${balance.updatedAt}`}>
						{balance.updatedAt}
					</Link>
				}
			/>
		</ItemsTable>
	);
}

export default BalancesTable;
