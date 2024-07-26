/** @jsxImportSource @emotion/react */
import { css, Theme } from "@mui/material";
import { Extrinsic, Resource } from "../../model";
import { NETWORK_CONFIG } from "../../config";
import { useBlock, useRuntimeSpec } from "../../hooks";
import { encodeAddress, getCallMetadataByName } from "../../utils";
import {
    InfoTableAttribute,
    InfoTable,
    BlockTimestamp,
    AccountAddress,
    ButtonLink,
    Currency,
    DataViewer,
    InfoTooltip,
    Link,
} from "../elements";

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

const tipStyle = css`
    display: flex;
    align-items: center;
    gap: 4px;
`;

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
    const { extrinsic } = props;
    const block = useBlock(
        { id: { equalTo: extrinsic.data?.blockHeight } },
        { skip: extrinsic.loading }
    );
    const { runtimeSpec, loading: loadingRuntimeSpec } = useRuntimeSpec(
        block?.data?.specVersion
    );
    const { currency } = NETWORK_CONFIG;

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
                render={(data) => (
                    <BlockTimestamp
                        blockHeight={data.blockHeight}
                        timezone
                        utc
                    />
                )}
            />
            <ExtrinsicInfoTableAttribute
                label="Block time"
                render={(data) => (
                    <BlockTimestamp
                        blockHeight={data.blockHeight}
                        fromNow
                        utc
                    />
                )}
            />
            <ExtrinsicInfoTableAttribute
                label="Hash"
                render={(data) => data.txHash}
                copyToClipboard={(data) => data.txHash}
            />
            <ExtrinsicInfoTableAttribute
                label="Block"
                render={(data) => (
                    <Link to={`/block/${data.blockHeight.toString()}`}>
                        {data.blockHeight.toString()}
                    </Link>
                )}
                copyToClipboard={(data) => data.blockHeight.toString()}
            />
            <ExtrinsicInfoTableAttribute
                label="Account"
                render={(data) =>
                    data.signer && (
                        <AccountAddress
                            address={data.signer}
                            prefix={NETWORK_CONFIG.prefix}
                        />
                    )
                }
                copyToClipboard={(data) =>
                    data.signer &&
                    encodeAddress(data.signer, NETWORK_CONFIG.prefix)
                }
                hide={(data) => !data.signer}
            />
            <ExtrinsicInfoTableAttribute
                label="Result"
                render={(data) => (
                    <>
                        {data.success ? (
                            <span css={successStyle}>&#x1F5F9;</span>
                        ) : (
                            <span css={failedStyle}>&#x1F5F5;</span>
                        )}
                    </>
                )}
            />
            <ExtrinsicInfoTableAttribute
                label="Name"
                render={(data) => (
                    <ButtonLink
                        to={`/search?query=${data.module}.${data.call}`}
                        size="small"
                        color="secondary"
                    >
                        {data.module}.{data.call}
                    </ButtonLink>
                )}
            />
            <ExtrinsicInfoTableAttribute
                label={() => (
                    <div css={tipStyle}>
                        <div>Tip</div>
                        <InfoTooltip value="A TIP is an extra transaction fee used to prioritize your extrinsic for inclusion in the block." />
                    </div>
                )}
                render={(data) => (
                    <Currency
                        amount={data.tip}
                        currency={currency}
                        decimalPlaces="optimal"
                        showFullInTooltip
                    />
                )}
            />
            {!loadingRuntimeSpec && runtimeSpec ? (
                <ExtrinsicInfoTableAttribute
                    label="Parameters"
                    render={(data) => (
                        <DataViewer
                            data={data.args}
                            metadata={
                                getCallMetadataByName(
                                    runtimeSpec.metadata,
                                    data.module,
                                    data.call
                                )?.args
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
