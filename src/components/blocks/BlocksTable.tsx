import { Block } from "../../model/block";
import { PaginatedResource } from "../../model/paginatedResource";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlocksTableProps = {
	blocks: PaginatedResource<Block>,
	showTime?: boolean;
};

const BlocksTableAttribute = ItemsTableAttribute<Block>;

function ExtrinsicsTable(props: BlocksTableProps) {
	const {
		blocks,
		showTime,
	} = props;

	return (
		<ItemsTable
			data={blocks.data}
			loading={blocks.loading}
			notFound={blocks.notFound}
			notFoundMessage="No blocks found"
			error={blocks.error}
			pagination={blocks.pagination}
			data-test="blocks-table"
		>
			<BlocksTableAttribute
				label="Height"
				render={(block) =>
					<Link to={`/block/${block.id}`}>
						{block.height.toString()}
					</Link>
				}
			/>
			<BlocksTableAttribute
				label="Spec version"
				render={(block) =>
					<>{block.specVersion}</>

				}
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
