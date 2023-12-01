import { useEffect, useState } from "react";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortDirection } from "../../model/sortDirection";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { BlockTimestamp } from "../BlockTimestamp";
import { NETWORK_CONFIG } from "../../config";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Subnet } from "../../model/subnet";
import { SubnetsOrder } from "../../services/subnetsService";
import { SortOrder } from "../../model/sortOrder";

export type SubnetsTableProps = {
	subnets: PaginatedResource<Subnet>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: SubnetsOrder) => void;
	initialSort?: string;
};

const SubnetsTableAttribute = ItemsTableAttribute<Subnet>;

const orderMappings = {
	netUid: {
		[SortDirection.ASC]: "NET_UID_ASC",
		[SortDirection.DESC]: "NET_UID_DESC",
	},
	createdAt: {
		[SortDirection.ASC]: "CREATED_AT_ASC",
		[SortDirection.DESC]: "CREATED_AT_DESC",
	},
};

function SubnetsTable(props: SubnetsTableProps) {
	const { subnets } = props;

	const { initialSort, onSortChange } = props;
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
				direction:
					sort.direction === SortDirection.ASC
						? SortDirection.DESC
						: SortDirection.ASC,
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
			data={subnets.data}
			loading={subnets.loading}
			notFound={subnets.notFound}
			notFoundMessage="No subnets found"
			error={subnets.error}
			data-test="subnets-table"
			sort={sort}
			onSortChange={handleSortChange}
		>
			<SubnetsTableAttribute
				label="ID"
				sortable
				render={(subnet) => <>{subnet.netUid}</>}
				sortProperty="netUid"
			/>
			<SubnetsTableAttribute
				label="Name"
				render={(subnet) => 
					<Link to={`https://taostats.io/subnets/netuid-${subnet.netUid}`}>
						{subnet.name}
					</Link>
				}
			/>
			<SubnetsTableAttribute
				label="Created At (UTC)"
				sortable
				render={(subnet) => (
					<BlockTimestamp
						blockHeight={subnet.createdAt}
						tooltip
						utc
						timezone={false}
					/>
				)}
				sortProperty="createdAt"
			/>
			<SubnetsTableAttribute
				label="Owner"
				render={(subnet) => (
					<AccountAddress
						address={decodeAddress(subnet.owner)}
						prefix={NETWORK_CONFIG.prefix}
						copyToClipboard="normal"
						shorten
					/>
				)}
			/>
		</ItemsTable>
	);
}

export default SubnetsTable;
