/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { NETWORK_CONFIG } from "../../config";
import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { BalancesFilter, BalancesOrder } from "../../services/balancesService";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

export type BalancesTableProps = {
	balances: PaginatedResource<Balance>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: BalancesOrder) => void;
	initialSort?: string;
	onFilterChange?: (newFilter?: BalancesFilter) => void;
	initialFilter?: BalancesFilter;
	onSearchChange?: (newSearch?: string) => void;
	initialSearch?: string;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance>;

const orderMappings = {
	free: {
		[SortDirection.ASC]: "BALANCE_FREE_ASC",
		[SortDirection.DESC]: "BALANCE_FREE_DESC",
	},
	delegated: {
		[SortDirection.ASC]: "BALANCE_STAKED_ASC",
		[SortDirection.DESC]: "BALANCE_STAKED_DESC",
	},
	total: {
		[SortDirection.ASC]: "BALANCE_TOTAL_ASC",
		[SortDirection.DESC]: "BALANCE_TOTAL_DESC",
	},
	updated_at: {
		[SortDirection.ASC]: "UPDATED_AT_ASC",
		[SortDirection.DESC]: "UPDATED_AT_DESC",
	},
};

function BalancesTable(props: BalancesTableProps) {
	const {
		balances,
		initialSort,
		onSortChange,
	} = props;
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
			data={balances.data}
			additionalData={[]}
			loading={balances.loading}
			notFound={balances.notFound}
			notFoundMessage="No balances found"
			error={balances.error}
			pagination={balances.pagination}
			data-test="balances-table"
			showRank
			sort={sort}
			onSortChange={handleSortChange}
		>
			<BalancesItemsTableAttribute
				label="Account"
				render={(balance) => (
					<AccountAddress
						address={decodeAddress(balance.address)}
						prefix={NETWORK_CONFIG.prefix}
						copyToClipboard="normal"
						shorten
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label="Free"
				sortable
				sortProperty="free"
				render={(balance) => (
					<Currency
						amount={balance.free}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label="Staked"
				sortable
				sortProperty="delegated"
				render={(balance) => (
					<Currency
						amount={balance.staked}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>

			<BalancesItemsTableAttribute
				label="Total"
				sortable
				sortProperty="total"
				render={(balance) => (
					<Currency
						amount={balance.total}
						currency={NETWORK_CONFIG.currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>
		</ItemsTable>
	);
}

export default BalancesTable;
