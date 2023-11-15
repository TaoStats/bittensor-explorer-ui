/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";
import { NETWORK_CONFIG } from "../../config";
import { Extrinsic } from "../../model/extrinsic";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../AccountAddress";
import { BlockTimestamp } from "../BlockTimestamp";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

const successStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.error.main};
`;

export type ExtrinsicsTableProps = {
	extrinsics: PaginatedResource<Extrinsic>;
	showAccount?: boolean;
	showTime?: boolean;
};

const ExtrinsicsTableAttribute = ItemsTableAttribute<Extrinsic>;

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
	const { extrinsics, showAccount, showTime } = props;

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
				render={(extrinsic) => (
					<Link to={`/extrinsic/${extrinsic.id}`}>{extrinsic.id}</Link>
				)}
			/>
			<ExtrinsicsTableAttribute
				label="Name"
				render={(extrinsic) => (
					<ButtonLink
						to={`/search?query=${extrinsic.module}.${extrinsic.call}`}
						size="small"
						color="secondary"
					>
						{extrinsic.module}.{extrinsic.call}
					</ButtonLink>
				)}
			/>
			{showAccount && (
				<ExtrinsicsTableAttribute
					label="Account"
					render={(extrinsic) =>
						extrinsic.signer && (
							<AccountAddress
								address={extrinsic.signer}
								prefix={NETWORK_CONFIG.prefix}
								shorten
								copyToClipboard="small"
							/>
						)
					}
				/>
			)}
			{showTime && (
				<ExtrinsicsTableAttribute
					label="Time"
					render={(extrinsic) => (
						<BlockTimestamp
							blockHeight={extrinsic.blockHeight}
							fromNow
							tooltip
							utc
						/>
					)}
				/>
			)}
			<ExtrinsicsTableAttribute
				label="Result"
				align="center"
				render={(extrinsic) =>
					extrinsic.success ? (
						<span css={successStyle}>&#x1F5F9;</span>
					) : (
						<span css={failedStyle}>&#x1F5F5;</span>
					)
				}
			/>
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
