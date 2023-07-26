/** @jsxImportSource @emotion/react */
import { css, Theme } from "@mui/material";

import { Call } from "../../model/call";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/formatAddress";
import { getCallMetadataByName } from "../../utils/queryMetadata";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type CallInfoTableProps = {
	network: string;
	call: Resource<Call>;
}

const CallInfoTableAttribute = InfoTableAttribute<Call>;

const successStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.error.main};
`;

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, call} = props;

	return (
		<InfoTable
			data={call.data}
			loading={call.loading}
			notFound={call.notFound}
			notFoundMessage="No call found"
			error={call.error}
		>
			<CallInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
			/>
			<CallInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<CallInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/block/${data.blockId}`}>
						{data.blockHeight}
					</Link>
				}
				copyToClipboard={(data) => data.blockId}
			/>
			<CallInfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link to={`/extrinsic/${data.extrinsicId}`}>
						{data.extrinsicId}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			<CallInfoTableAttribute
				label="Parent call"
				render={(data) => data.parentId &&
					<Link to={`/call/${data.parentId}`}>
						{data.parentId}
					</Link>
				}
				copyToClipboard={(data) => data.parentId}
				hide={(data) => !data.parentId}
			/>
			<CallInfoTableAttribute
				label="Sender"
				render={(data) => data.caller &&
					<AccountAddress
						network={network}
						address={data.caller}
						prefix={data.runtimeSpec.metadata.ss58Prefix}
					/>
				}
				copyToClipboard={(data) => data.caller &&
					encodeAddress(data.caller, data.runtimeSpec.metadata.ss58Prefix)
				}
				hide={(data) => !data.caller}
			/>
			<CallInfoTableAttribute
				label="Result"
				render={(data) =>
					<>
						{
							data.success ?
								<span css={successStyle}>&#x1F5F9;</span> :
								<span css={failedStyle}>&#x1F5F5;</span>
						}
					</>
				}
			/>
			<CallInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/search?query=${data.palletName}.${data.callName}`}
						size="small"
						color="secondary"
					>
						{data.palletName}.{data.callName}
					</ButtonLink>
				}
			/>
			<CallInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={
							getCallMetadataByName(
								data.runtimeSpec.metadata,
								data.palletName,
								data.callName
							)?.args
						}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
			/>
			<CallInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
