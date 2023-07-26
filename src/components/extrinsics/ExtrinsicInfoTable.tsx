/** @jsxImportSource @emotion/react */
import { css, Theme } from "@mui/material";

import { Extrinsic } from "../../model/extrinsic";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/formatAddress";
import { getCallMetadataByName } from "../../utils/queryMetadata";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicInfoTableProps = {
	network: string;
	extrinsic: Resource<Extrinsic>;
}

const ExtrinsicInfoTableAttribute = InfoTableAttribute<Extrinsic>;

const successStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
	font-size: 16px;
	color: ${theme.palette.error.main};
`;

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, extrinsic} = props;

	return (
		<InfoTable
			data={extrinsic.data}
			loading={extrinsic.loading}
			notFound={extrinsic.notFound}
			notFoundMessage="No extrinsic found"
			error={extrinsic.error}
		>
			<ExtrinsicInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} timezone utc />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<ExtrinsicInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/block/${data.blockId}`}>
						{data.blockHeight}
					</Link>
				}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<ExtrinsicInfoTableAttribute
				label="Account"
				render={(data) => data.signer &&
					<AccountAddress
						network={network}
						address={data.signer}
						prefix={data.runtimeSpec.metadata.ss58Prefix}
					/>
				}
				copyToClipboard={(data) => data.signer &&
					encodeAddress(data.signer, data.runtimeSpec.metadata.ss58Prefix)
				}
				hide={(data) => !data.signer}
			/>
			<ExtrinsicInfoTableAttribute
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
			<ExtrinsicInfoTableAttribute
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
			<ExtrinsicInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={getCallMetadataByName(data.runtimeSpec.metadata, data.palletName, data.callName)?.args}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Error"
				render={(data) => <DataViewer network={network} data={data.error} copyToClipboard />}
				hide={(data) => !data.error}
			/>
			<ExtrinsicInfoTableAttribute
				label="Fee"
				render={(data) => data.fee?.toString()}
				hide={(data) => !data.fee || data.fee === BigInt(0)}
			/>
			<ExtrinsicInfoTableAttribute
				label="Signature"
				render={(data) => data.signature &&
					<DataViewer
						simple
						network={network}
						data={data.signature}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
				hide={(data) => !data.signature}
			/>
			<ExtrinsicInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
