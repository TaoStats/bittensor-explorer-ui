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
import { BlockTimestamp } from "../BlockTimestamp";
import { NETWORK_CONFIG } from "../../config";
import { useBlock } from "../../hooks/useBlock";
import { useRuntimeSpec } from "../../hooks/useRuntimeSpec";

export type ExtrinsicInfoTableProps = {
	extrinsic: Resource<Extrinsic>;
};

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
	const { extrinsic } = props;
	const block = useBlock({ id: { equalTo: extrinsic.data?.blockHeight } });
	const { runtimeSpec, loading: loadingRuntimeSpec } = useRuntimeSpec(
		block?.data?.specVersion
	);

	return (
		<InfoTable
			data={extrinsic.data}
			loading={extrinsic.loading}
			notFound={extrinsic.notFound}
			notFoundMessage='No extrinsic found'
			error={extrinsic.error}
		>
			<ExtrinsicInfoTableAttribute
				label='Timestamp'
				render={(data) => (
					<BlockTimestamp blockHeight={data.blockHeight} timezone utc />
				)}
			/>
			<ExtrinsicInfoTableAttribute
				label='Block time'
				render={(data) => (
					<BlockTimestamp blockHeight={data.blockHeight} fromNow utc />
				)}
			/>
			<ExtrinsicInfoTableAttribute
				label='Hash'
				render={(data) => data.txHash}
				copyToClipboard={(data) => data.txHash}
			/>
			<ExtrinsicInfoTableAttribute
				label='Block'
				render={(data) => (
					<Link to={`/block/${data.blockHeight.toString()}`}>
						{data.blockHeight.toString()}
					</Link>
				)}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<ExtrinsicInfoTableAttribute
				label='Account'
				render={(data) =>
					data.signer && (
						<AccountAddress
							address={data.signer}
							prefix={NETWORK_CONFIG.prefix}
						/>
					)
				}
				copyToClipboard={(data) =>
					data.signer && encodeAddress(data.signer, NETWORK_CONFIG.prefix)
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
				label='Name'
				render={(data) => (
					<ButtonLink
						to={`/search?query=${data.module}.${data.call}`}
						size='small'
						color='secondary'
					>
						{data.module}.{data.call}
					</ButtonLink>
				)}
			/>
			{!loadingRuntimeSpec && runtimeSpec ? (
				<ExtrinsicInfoTableAttribute
					label='Parameters'
					render={(data) => (
						<DataViewer
							data={data.args}
							metadata={
								getCallMetadataByName(runtimeSpec.metadata, data.module, data.call)?.args
							}
							runtimeSpec={runtimeSpec}
							copyToClipboard
						/>
					)}
				/>
			) : (
				<></>
			)}

			{/* TODO: */}
			{/* <ExtrinsicInfoTableAttribute
				label='Signature'
				render={(data) =>
					data.signature && (
						<DataViewer
							simple
							data={data.signature}
							runtimeSpec={data.runtimeSpec}
							copyToClipboard
						/>
					)
				}
				hide={(data) => !data.signature}
			/> */}
		</InfoTable>
	);
};
