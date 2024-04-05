/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { MinerIP } from "../../model/subnet";
import { PaginatedResource } from "../../model/paginatedResource";
import { css } from "@emotion/react";
import { shortenIP } from "../../utils/number";
import { MinerIPOrder } from "../../services/subnetsService";
import { useState, useEffect } from "react";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";

const whiteText = css`
	color: white;
`;

export type MinerIPTableProps = {
	minerIPs: PaginatedResource<MinerIP>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: MinerIPOrder) => void;
	initialSort?: string;
};

const MinerIPTableAttribute = ItemsTableAttribute<MinerIP>;

const orderMappings = {
	ipAddress: {
		[SortDirection.ASC]: "IP_ADDRESS_ASC",
		[SortDirection.DESC]: "IP_ADDRESS_DESC",
	},
	minersCount: {
		[SortDirection.ASC]: "MINERS_COUNT_ASC",
		[SortDirection.DESC]: "MINERS_COUNT_DESC",
	},
};

function MinerIPTable(props: MinerIPTableProps) {
	const { minerIPs, initialSort, onSortChange } = props;
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
			data={minerIPs.data}
			loading={minerIPs.loading}
			notFound={minerIPs.notFound}
			notFoundMessage="No miner ip address found"
			error={minerIPs.error}
			pagination={minerIPs.pagination}
			data-test="miner-ip-table"
			sort={sort}
			onSortChange={handleSortChange}
		>
			<MinerIPTableAttribute
				label="IP"
				sortable
				render={(minerIP) => (
					<span css={whiteText}> {shortenIP(minerIP.ipAddress)} </span>
				)}
				sortProperty="ipAddress"
			/>
			<MinerIPTableAttribute
				label="UIDs"
				sortable
				render={(minerIP) => (
					<span css={whiteText}> {minerIP.minersCount} </span>
				)}
				sortProperty="minersCount"
			/>
		</ItemsTable>
	);
}

export default MinerIPTable;
