import { Block } from "../../model/block";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import { AccountAddress } from "../AccountAddress";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlockInfoTableProps = {
	block: Resource<Block>;
}

const BlockInfoTableAttribute = InfoTableAttribute<Block>;

export const BlockInfoTable = (props: BlockInfoTableProps) => {
	const { block } = props;

	return (
		<InfoTable
			data={block.data}
			loading={block.loading}
			notFound={block.notFound}
			notFoundMessage="No block found"
			error={block.error}
		>
			<BlockInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
				hide={(data) => data.height.toString() === "0"}
			/>
			<BlockInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow utc />
				}
				hide={(data) => data.height.toString() === "0"}
			/>
			<BlockInfoTableAttribute
				label="Block height"
				render={(data) => data.height.toString()}
			/>
			<BlockInfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<BlockInfoTableAttribute
				label="Parent hash"
				render={(data) =>
					data.height > 1 ? 
						<Link to={`/block/${(BigInt(data.height) - BigInt(1)).toString()}`}>
							{data.parentHash}
						</Link> : <>{data.parentHash}</>
				}
				copyToClipboard={(data) => data.parentHash}
			/>
			<BlockInfoTableAttribute
				label="Validator"
				render={(data) => data.validator &&
					<AccountAddress
						address={data.validator}
						prefix={data.runtimeSpec.metadata.ss58Prefix}
					/>
				}
				copyToClipboard={(data) => data.validator &&
					encodeAddress(
						data.validator,
						data.runtimeSpec.metadata.ss58Prefix
					)
				}
				hide={(data) => !data.validator}
			/>
			<BlockInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>

	);
};
