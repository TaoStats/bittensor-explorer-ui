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

export type NominatorsTableProps = {
	nominators: PaginatedResource<DelegateBalance>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: DelegateBalancesOrder) => void;
	initialSort?: string;
};

const NominatorsTableAttribute = ItemsTableAttribute<DelegateBalance>;

const orderMappings = {
	amount: {
		[SortDirection.ASC]: "AMOUNT_ASC",
		[SortDirection.DESC]: "AMOUNT_DESC",
	},
};

function NominatorsTable(props: NominatorsTableProps) {
	const { nominators } = props;

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
		</ItemsTable>
	);
}

export default NominatorsTable;
