/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortDirection } from "../../model/sortDirection";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Subnet } from "../../model/subnet";
import { SubnetsOrder } from "../../services/subnetsService";
import { SortOrder } from "../../model/sortOrder";
import { useSubnetEmissions } from "../../hooks/useSubnetEmissions";
import { Theme, css } from "@emotion/react";

const successStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.error.main};
`;

export type SubnetsTableProps = {
	subnets: PaginatedResource<Subnet>;
	registrations?: bigint[];
	validatorPermits?: bigint[];
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
	emission: {
		[SortDirection.ASC]: "ID_ASC",
		[SortDirection.DESC]: "ID_DESC",
	},
};

function SubnetsTable(props: SubnetsTableProps) {
	const { subnets, registrations, validatorPermits } = props;

	const emissions = useSubnetEmissions();

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();

	const sortedSubnets = useMemo(() => {
		if (
			subnets.loading ||
			subnets.error ||
			subnets.data === undefined ||
			emissions === undefined
		)
			return subnets.data;
		if (sort?.property !== "emission") return subnets.data;
		return subnets.data.sort((left: Subnet, right: Subnet) => {
			if (sort?.direction === SortDirection.ASC)
				return emissions[left.netUid] - emissions[right.netUid];
			return emissions[right.netUid] - emissions[left.netUid];
		});
	}, [subnets, emissions, sort]);

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
			data={sortedSubnets}
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
				render={(subnet) => (
					<Link to={`https://taostats.io/subnets/netuid-${subnet.netUid}`}>
						{subnet.name}
					</Link>
				)}
			/>
			<SubnetsTableAttribute
				label="Registration"
				render={(subnet) =>
					registrations?.find((regist: bigint) => {
						if(regist.toString() == subnet.netUid.toString())
							return true;
						return false;
					}) ? (
							<span css={successStyle}>&#x1F5F9;</span>
						) : (
							<span css={failedStyle}>&#x1F5F5;</span>
						)
				}
			/>
			<SubnetsTableAttribute
				label="Validator Permits"
				render={(subnet) =>
					validatorPermits?.find((permit: bigint) => {
						if(permit.toString() == subnet.netUid.toString())
							return true;
						return false;
					}) ? (
							<span css={successStyle}>&#x1F5F9;</span>
						) : (
							<span css={failedStyle}>&#x1F5F5;</span>
						)
				}
			/>
		</ItemsTable>
	);
}

export default SubnetsTable;
