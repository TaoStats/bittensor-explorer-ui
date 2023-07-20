import { Extrinsic } from "../../model/extrinsic";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicsTableProps = {
	extrinsics: PaginatedResource<Extrinsic>,
	showAccount?: boolean;
	showTime?: boolean;
};

const ExtrinsicsTableAttribute = ItemsTableAttribute<Extrinsic>;

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
	const {
		extrinsics,
		showAccount,
		showTime,
	} = props;

	return (
		<ItemsTable
			data={extrinsics.data}
			loading={extrinsics.loading}
			notFound={extrinsics.notFound}
			notFoundMessage="No extrinsics found"
			error={extrinsics.error}
			pagination={extrinsics.pagination}
			data-test="extrinsics-table"
		>
			<ExtrinsicsTableAttribute
				label="ID"
				render={(extrinsic) =>
					<Link to={`/extrinsic/${extrinsic.id}`}>
						{extrinsic.id}
					</Link>
				}
			/>
			<ExtrinsicsTableAttribute
				label="Name"
				render={(extrinsic) =>
					<ButtonLink
						to={`/search?query=${extrinsic.module}.${extrinsic.call}`}
						size="small"
						color="secondary"
					>
						{extrinsic.module}.{extrinsic.call}
					</ButtonLink>
				}
			/>
			{showAccount &&
				<ExtrinsicsTableAttribute
					label="Account"
					render={(extrinsic) =>
						extrinsic.signer &&
							<AccountAddress
								address={extrinsic.signer}
								prefix={extrinsic.runtimeSpec.metadata.ss58Prefix}
								shorten
								copyToClipboard="small"
							/>
					}
				/>
			}
			{showTime &&
				<ExtrinsicsTableAttribute
					label="Time"
					render={(extrinsic) =>
						<Time time={extrinsic.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
