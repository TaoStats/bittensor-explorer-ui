import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

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
	extrinsic: Resource<Extrinsic>;
}

const ExtrinsicInfoTableAttribute = InfoTableAttribute<Extrinsic>;

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {extrinsic} = props;

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
				render={(data) => <Time time={data.timestamp} timezone utc />}
			/>
			<ExtrinsicInfoTableAttribute
				label='Block time'
				render={(data) => <Time time={data.timestamp} fromNow />}
			/>
			<ExtrinsicInfoTableAttribute
				label='Hash'
				render={(data) => data.extrinsicHash}
				copyToClipboard={(data) => data.extrinsicHash}
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
							prefix={data.runtimeSpec.metadata.ss58Prefix}
						/>
					)
				}
				copyToClipboard={(data) =>
					data.signer &&
          encodeAddress(data.signer, data.runtimeSpec.metadata.ss58Prefix)
				}
				hide={(data) => !data.signer}
			/>
			<ExtrinsicInfoTableAttribute
				label='Result'
				render={(data) => (
					<Chip
						variant='outlined'
						icon={<img src={data.success ? CheckIcon : CrossIcon} />}
						label={data.success ? "Success" : "Fail"}
					/>
				)}
			/>
			{/* <ExtrinsicInfoTableAttribute
				label='Name'
				render={(data) => (
					<ButtonLink
						to={`/search?query=${data.palletName}.${data.callName}`}
						size='small'
						color='secondary'
					>
						{data.palletName}.{data.callName}
					</ButtonLink>
				)}
			/> */}
			{/* <ExtrinsicInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						data={data.args}
						metadata={getCallMetadataByName(data.runtimeSpec.metadata, data.palletName, data.callName)?.args}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
			/> */}
			{/* <ExtrinsicInfoTableAttribute
				label='Error'
				render={(data) => <DataViewer data={data.error} copyToClipboard />}
				hide={(data) => !data.error}
			/>
			<ExtrinsicInfoTableAttribute
				label='Fee'
				render={(data) => data.fee?.toString()}
				hide={(data) => !data.fee || data.fee === BigInt(0)}
			/>
			<ExtrinsicInfoTableAttribute
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
			<ExtrinsicInfoTableAttribute
				label='Spec version'
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
