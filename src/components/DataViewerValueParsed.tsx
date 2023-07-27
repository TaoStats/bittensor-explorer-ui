/** @jsxImportSource @emotion/react */
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { css } from "@emotion/react";

import { DecodedArg } from "../model/decodedMetadata";
import { noCase } from "../utils/string";

import { AccountAddress } from "./AccountAddress";
import { RuntimeSpec } from "../model/runtimeSpec";

// found in https://github.com/polkadot-js/apps/blob/59c2badf87c29fd8cb5b7dfcc045c3ce451a54bc/packages/react-params/src/Param/findComponent.ts#L51
const ADDRESS_TYPES = [
	"AccountId",
	"AccountId20",
	"AccountId32",
	"Address",
	"LookupSource",
	"MultiAddress",
];

const valueTableStyle = css`
  width: max-content;
  word-break: initial;

  th,
  td {
    vertical-align: top;
    padding: 0;
  }

	td:first-of-type {
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
	}
`;

const arrayIndexCellStyle = css`
  width: 60px;
`;

const arrayIndexStyle = css`
  font-weight: 300;
  word-break: break-all;
  box-sizing: border-box;
  width: max-content;
  padding: 6px 0;
  padding-right: 16px;
  position: sticky;
  top: 0;
`;

const objectKeyCellStyle = css`
  width: 180px;
`;

const objectKeyStyle = css`
	font-weight: 500;
	word-break: break-all;
	box-sizing: border-box;
	width: 180px;
	padding: 6px 0;
	padding-right: 32px;
	position: sticky;
	top: 0;
`;

const kindStyle = css`
  font-weight: 400;
  font-style: italic;
`;

const valueStyle = css`
  display: flex;
  word-break: break-all;
  min-width: 180px;
  max-width: 550px;
  padding: 6px 0;
`;

type ValueOfKindProps = {
	value: {
		__kind: string;
		value: any;
	};
	valueMetadata?: DecodedArg;
	runtimeSpec?: RuntimeSpec;
};

const ValueOfKind = (props: ValueOfKindProps) => {
	const {
		value: { __kind: kind, ...value },
		valueMetadata: metadata,
		runtimeSpec,
	} = props;

	return (
		<Table size='small' css={valueTableStyle}>
			<TableBody>
				<TableRow>
					<TableCell css={objectKeyCellStyle}>
						<div css={[objectKeyStyle, kindStyle]}>{kind}</div>
					</TableCell>
					<TableCell>
						<DataViewerValueParsed
							value={value.value || value}
							metadata={metadata}
							runtimeSpec={runtimeSpec}
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};

type MaybeAccountLinkValueProps = {
	value: any;
	valueMetadata: DecodedArg;
	runtimeSpec: RuntimeSpec;
};

const AccountValue = (props: MaybeAccountLinkValueProps) => {
	const { value, valueMetadata, runtimeSpec } = props;

	if (valueMetadata.type === "MultiAddress") {
		if (value.__kind === "Id") {
			return (
				<ValueOfKind
					value={value}
					valueMetadata={{
						...valueMetadata,
						type: "AccountId",
					}}
					runtimeSpec={runtimeSpec}
				/>
			);
		} else {
			return <DataViewerValueParsed value={value} runtimeSpec={runtimeSpec} />;
		}
	}

	return (
		<div css={valueStyle}>
			<AccountAddress
				address={value}
				prefix={runtimeSpec.metadata.ss58Prefix}
				copyToClipboard='small'
			/>
		</div>
	);
};

export type DataViewerValueParsedProps = {
	value: any;
	metadata?: DecodedArg[] | DecodedArg;
	runtimeSpec?: RuntimeSpec;
};

export const DataViewerValueParsed = (props: DataViewerValueParsedProps) => {
	const { metadata, runtimeSpec } = props;
	let { value } = props;

	if (
		metadata &&
    runtimeSpec &&
    ADDRESS_TYPES.includes((metadata as DecodedArg).type)
	) {
		return (
			<AccountValue
				value={value}
				valueMetadata={metadata as DecodedArg}
				runtimeSpec={runtimeSpec}
			/>
		);
	}

	if (Array.isArray(value) && value.length > 0) {
		const itemsMetadata = value.map((item, index) => {
			if (Array.isArray(metadata)) {
				return metadata[index];
			}

			const vecType = metadata?.type.match(/^Vec<(.+)>$/);
			if (vecType) {
				return {
					name: index.toString(),
					type: vecType[1]!,
				};
			}

			return undefined;
		});

		return (
			<Table size='small' css={valueTableStyle}>
				<TableBody>
					{value.map((item, index) => (
						<TableRow key={index}>
							<TableCell css={arrayIndexCellStyle}>
								<div css={arrayIndexStyle}>{itemsMetadata[index]?.name}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed
									value={item}
									metadata={itemsMetadata[index]}
									runtimeSpec={runtimeSpec}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (Array.isArray(value) && value.length === 0) {
		value = "[ ]";
	} else if (value && typeof value === "object") {
		if (value.__kind) {
			return <ValueOfKind value={value} runtimeSpec={runtimeSpec} />;
		}

		const keys = Object.keys(value);
		keys.sort();

		return (
			<Table size='small' css={valueTableStyle}>
				<TableBody>
					{keys.map((key) => (
						<TableRow key={key}>
							<TableCell css={objectKeyCellStyle}>
								<div css={objectKeyStyle}>{key}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed
									value={value[key]}
									metadata={
										Array.isArray(metadata)
											? metadata?.find((it) => noCase(it.name) === noCase(key))
											: undefined
									}
									runtimeSpec={runtimeSpec}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (typeof value === "boolean") {
		value = value ? "true" : "false";
	}

	return <div css={valueStyle}>{value}</div>;
};
