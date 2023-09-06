import { useEffect, useState } from "react";
import { Block } from "../../model/block";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortOrder } from "../../model/sortOrder";
import { SortDirection } from "../../model/sortDirection";
import { BlocksOrder } from "../../services/blocksService";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlocksTableProps = {
	blocks: PaginatedResource<Block>,
	showTime?: boolean;
	initialSortOrder?: string;
	onSortChange?: (orderBy: BlocksOrder) => void;
	initialSort?: string;
};

const BlocksTableAttribute = ItemsTableAttribute<Block>;

const orderMappings = {
	height: {
		[SortDirection.ASC]: "HEIGHT_ASC",
		[SortDirection.DESC]: "HEIGHT_DESC",
	},
	eventCount: {
		[SortDirection.ASC]: "EVENT_COUNT_ASC",
		[SortDirection.DESC]: "EVENT_COUNT_DESC",
	},
	extrinsicCount: {
		[SortDirection.ASC]: "EXTRINSIC_COUNT_ASC",
		[SortDirection.DESC]: "EXTRINSIC_COUNT_DESC",
	},
};

function ExtrinsicsTable(props: BlocksTableProps) {
	const {
		blocks,
		showTime,
	} = props;

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
			data={blocks.data}
			loading={blocks.loading}
			notFound={blocks.notFound}
			notFoundMessage="No blocks found"
			error={blocks.error}
			pagination={blocks.pagination}
			data-test="blocks-table"
			sort={sort}
			onSortChange={handleSortChange}
		>
			<BlocksTableAttribute
				label="Height"
				sortable
				render={(block) =>
					<Link to={`/block/${block.id}`}>
						{block.height.toString()}
					</Link>
				}
				sortProperty='height'
			/>
			<BlocksTableAttribute
				label="Spec version"
				render={(block) =>
					<>{block.specVersion}</>

				}
			/>
			<BlocksTableAttribute
				label="Events"
				sortable
				render={(block) =>
					<>{block.eventCount}</>
				}
				sortProperty='eventCount'
			/>
			<BlocksTableAttribute
				label="Extrinsics"
				sortable
				render={(block) =>
					<>{block.extrinsicCount}</>
				}
				sortProperty='extrinsicCount'
			/>
			{showTime &&
				<BlocksTableAttribute
					label="Time"
					render={(block) =>
						<Time time={block.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
