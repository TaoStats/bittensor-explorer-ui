import { NeuronMetagraph } from "../../model";
import { formatNumber, rawAmountToDecimal, shortenIP } from "../../utils";
import {
    BlockTimestamp,
    ItemsTable,
    ItemsTableAttribute,
    Link,
} from "../elements";

/** @jsxImportSource @emotion/react */
export type HotkeyMetagraphTableProps = {
    loading: boolean;
    error: any;
    data: NeuronMetagraph[];
};

const HotkeyMetagraphTableAttribute = ItemsTableAttribute<NeuronMetagraph>;

export function HotkeyMetagraphTable(props: HotkeyMetagraphTableProps) {
    const { loading, error, data } = props;

    return (
        <ItemsTable
            data={data}
            loading={loading}
            error={error}
            data-test="hotkey-metagraph-table"
        >
            <HotkeyMetagraphTableAttribute
                label="NetUID"
                render={(meta) => (
                    <Link href={`/subnet/${meta.netUid}`} target="_self">
                        {meta.netUid}
                    </Link>
                )}
            />
            <HotkeyMetagraphTableAttribute
                label="Position"
                render={(meta) => <>{meta.rank}</>}
            />
            <HotkeyMetagraphTableAttribute
                label="UID"
                render={(meta) => <>{meta.uid}</>}
            />
            <HotkeyMetagraphTableAttribute
                label="Registered (UTC)"
                render={(meta) => (
                    <BlockTimestamp
                        blockHeight={meta.registeredAt}
                        utc
                        timezone={false}
                        tooltip
                    />
                )}
            />
            <HotkeyMetagraphTableAttribute
                label="Daily Rewards"
                render={(meta) => (
                    <>
                        {formatNumber(
                            rawAmountToDecimal(meta.dailyReward.toString()),
                            {
                                decimalPlaces: 3,
                            }
                        )}
                    </>
                )}
            />
            <HotkeyMetagraphTableAttribute
                label="Incentive"
                render={(meta) => (
                    <>
                        {formatNumber(meta.incentive / 65535, {
                            decimalPlaces: 5,
                        })}
                    </>
                )}
            />
            <HotkeyMetagraphTableAttribute
                label="Updated"
                render={({ updated }) => <>{updated}</>}
            />
            <HotkeyMetagraphTableAttribute
                label="Axon"
                render={(meta) => <>{shortenIP(meta.axonIp)}</>}
            />
        </ItemsTable>
    );
}
