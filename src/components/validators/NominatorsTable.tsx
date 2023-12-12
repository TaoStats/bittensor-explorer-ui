/** @jsxImportSource @emotion/react */

import { PaginatedResource } from "../../model/paginatedResource";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { NETWORK_CONFIG } from "../../config";
import { SortDirection } from "../../model/sortDirection";
import { useEffect, useState } from "react";
import { SortOrder } from "../../model/sortOrder";
import { DelegateBalancesOrder } from "../../services/delegateService";
import { DelegateBalance } from "../../model/delegate";
import useIsMobile from "../../hooks/useIsMobile";
import { BlockTimestamp } from "../BlockTimestamp";
import { fetchBlockTimestamps } from "../../utils/block";
import { formatCurrency, rawAmountToDecimal } from "../../utils/number";

export type NominatorsTableProps = {
	nominators: PaginatedResource<DelegateBalance>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: DelegateBalancesOrder) => void;
	initialSort?: string;
	address?: string;
	download?: boolean;
};

const NominatorsTableAttribute = ItemsTableAttribute<DelegateBalance>;

const orderMappings = {
	amount: {
		[SortDirection.ASC]: "AMOUNT_ASC",
		[SortDirection.DESC]: "AMOUNT_DESC",
	},
	delegateFrom: {
		[SortDirection.ASC]: "DELEGATE_FROM_DESC",
		[SortDirection.DESC]: "DELEGATE_FROM_ASC",
	},
};

function NominatorsTable(props: NominatorsTableProps) {
	const { nominators, address, download } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();

	const isMobile = useIsMobile();

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
	
	const getExportCSV = async () => {
		const columns = [
			{
				key: "account",
				displayLabel: "Account"
			},
			{
				key: "amount",
				displayLabel: "Amount"
			},
			{
				key: "delegatedFrom",
				displayLabel: "Delegated From(UTC)"
			},
		];
		const data: any[] = [];
		if(!nominators.loading && !nominators.notFound && nominators.data !== undefined) {
			const blockNumbers = nominators.data.reduce((prev: bigint[], cur: DelegateBalance) => {
				prev.push(cur.delegateFrom);
				return prev;
			}, []);
			const blockTimestamps = await fetchBlockTimestamps(blockNumbers);

			nominators.data.forEach((delegate: DelegateBalance) => {
				const delegatedFrom = blockTimestamps[delegate.delegateFrom.toString()];
				const amount = formatCurrency(
					rawAmountToDecimal(delegate.amount.toString()),
					currency,
					{
						decimalPlaces: "optimal",
					}
				);
				data.push({
					account: delegate.account,
					amount,
					delegatedFrom,
				});
			});
		}
		return {
			columns,
			data,
			filename: `nominators-${address}`,
		};
	};

	return (
		<ItemsTable
			data={nominators.data}
			loading={nominators.loading}
			notFound={nominators.notFound}
			notFoundMessage='No nominators found'
			error={nominators.error}
			pagination={nominators.pagination}
			data-test='nominators-table'
			sort={sort}
			onSortChange={handleSortChange}
			getExportCSV={download ? getExportCSV : undefined}
		>
			<NominatorsTableAttribute
				label='Account'
				render={(nominator) => (
					<AccountAddress
						address={nominator.account}
						prefix={prefix}
						link
						shorten={isMobile}
						copyToClipboard='small'
					/>
				)}
			/>
			<NominatorsTableAttribute
				label='Amount'
				render={(nominator) => (
					<Currency
						amount={nominator.amount}
						currency={currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
				sortable
				sortProperty='amount'
			/>
			<NominatorsTableAttribute
				label='Delegated From'
				sortable
				sortProperty='delegateFrom'
				render={(balance) => (
					<BlockTimestamp
						blockHeight={balance.delegateFrom}
						fromNow
						utc
						tooltip
					/>
				)}
			/>
		</ItemsTable>
	);
}

export default NominatorsTable;
