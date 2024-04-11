/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { PaginatedResource } from "../../model/paginatedResource";
import { css } from "@emotion/react";
import { MinerColdkeyOrder } from "../../services/subnetsService";
import { useState, useEffect } from "react";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { MinerColdKey } from "../../model/subnet";
import { Link } from "../Link";

const whiteText = css`
	color: white;
`;

export type MinerColdkeyTableProps = {
	minerColdkeys: PaginatedResource<MinerColdKey>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: MinerColdkeyOrder) => void;
	initialSort?: string;
};

const MinerColdkeyTableAttribute = ItemsTableAttribute<MinerColdKey>;

const orderMappings = {
	coldkey: {
		[SortDirection.ASC]: "COLDKEY_ASC",
		[SortDirection.DESC]: "COLDKEY_DESC",
	},
	minersCount: {
		[SortDirection.ASC]: "MINERS_COUNT_ASC",
		[SortDirection.DESC]: "MINERS_COUNT_DESC",
	},
};

function MinerColdkeyTable(props: MinerColdkeyTableProps) {
	const { minerColdkeys, initialSort, onSortChange } = props;
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
			data={minerColdkeys.data}
			loading={minerColdkeys.loading}
			notFound={minerColdkeys.notFound}
			notFoundMessage="No miner coldkey found"
			error={minerColdkeys.error}
			pagination={minerColdkeys.pagination}
			data-test="miner-ip-table"
			sort={sort}
			onSortChange={handleSortChange}
		>
			<MinerColdkeyTableAttribute
				label="Coldkey"
				sortable
				render={(minerColdkey) => (
					<Link to={`/coldkey/${minerColdkey.coldkey}`} color="white">
						{minerColdkey.coldkey}
					</Link>
				)}
				sortProperty="coldkey"
			/>
			<MinerColdkeyTableAttribute
				label="UIDs"
				sortable
				render={(minerColdkey) => (
					<span css={whiteText}> {minerColdkey.minersCount} </span>
				)}
				sortProperty="minersCount"
			/>
		</ItemsTable>
	);
}

export default MinerColdkeyTable;
