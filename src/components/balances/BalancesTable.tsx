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
import { Link } from "../Link";
import { rawAmountToDecimaledString } from "../../utils/number";

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

const filterMappings: BalancesFilter = {
	balanceTotal: {
		key: "Balance >",
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

function BalancesTable(props: BalancesTableProps) {
	const { balances, initialSort, onSortChange, initialFilter, onFilterChange, initialSearch, onSearchChange } =
    props;
	const [sort, setSort] = useState<SortOrder<string>>();
	const [filter, setFilter] = useState<BalancesFilter | undefined>();
	const [search, setSearch] = useState(initialSearch);

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
				direction: sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
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

	const handleSearchChange = (value?: string) => {
		setSearch(value);
	};

	useEffect(() => {
		if(!onSearchChange) return;
		onSearchChange(search);
	}, [search]);

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
			filterMappings={filterMappings}
			filter={filter}
			onFilterChange={handleFilterChange}
			search={search}
			onSearchChange={handleSearchChange}
			searchPlaceholder="ACCOUNT"
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
				label="Delegated"
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

			<BalancesItemsTableAttribute
				label="Last update"
				sortable
				sortProperty="updated_at"
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
