/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css } from "@emotion/react";
import Decimal from "decimal.js";
import { NETWORK_CONFIG } from "../../config";
import { useTaoPrice } from "../../hooks";
import { ColdkeyInfo } from "../../model";
import { DataError, formatNumber, rawAmountToDecimal } from "../../utils";
import { InfoTableAttribute, InfoTable, Spinner, Link } from "../elements";

export type ColdkeyInfoTableProps = {
    coldkey: string;
    info: {
        loading: boolean;
        data: ColdkeyInfo[];
        error?: DataError;
    };
};

const addressItem = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ColdkeyInfoTableAttribute = InfoTableAttribute<any>;

export const ColdkeyInfoTable = (props: ColdkeyInfoTableProps) => {
    const { coldkey, info } = props;

    const taoPrice = useTaoPrice();

    const [totalKeys, totalNeurons, totalStake, totalDailyReward] =
        useMemo(() => {
            const hotkeys: Set<string> = new Set();
            let totalStake: Decimal = new Decimal(0);
            let totalDailyReward: Decimal = new Decimal(0);

            if (info.loading || !info.data)
                return [hotkeys.size, 0, totalStake, totalDailyReward];

            info.data.forEach(({ hotkey, stake, dailyReward }) => {
                totalDailyReward = totalDailyReward.add(
                    rawAmountToDecimal(dailyReward.toString())
                );
                if (hotkeys.has(hotkey)) return;
                hotkeys.add(hotkey);
                totalStake = totalStake.add(
                    rawAmountToDecimal(stake.toString())
                );
            });

            return [
                hotkeys.size,
                info.data.length,
                totalStake,
                totalDailyReward,
            ];
        }, [info]);

    return (
        <InfoTable
            data={info}
            loading={info.loading}
            notFound={info.error !== undefined}
            notFoundMessage="Invalid coldkey."
            error={info.error}
        >
            <ColdkeyInfoTableAttribute
                label="Coldkey"
                render={() => (
                    <Link
                        href={`/account/${coldkey}`}
                        color="white"
                        target="_self"
                        css={addressItem}
                    >
                        {coldkey} ▶
                    </Link>
                )}
                copyToClipboard={() => coldkey}
            />
            <ColdkeyInfoTableAttribute
                label="Total Neurons"
                render={() => totalNeurons}
            />
            <ColdkeyInfoTableAttribute
                label="Total Hotkeys"
                render={() => totalKeys}
            />
            <ColdkeyInfoTableAttribute
                label="Daily Rewards"
                render={() =>
                    taoPrice.loading ? (
                        <Spinner small />
                    ) : (
                        <span>
                            {NETWORK_CONFIG.currency}
                            {formatNumber(totalDailyReward, {
                                decimalPlaces: 3,
                            })}
                            &nbsp; ($
                            {formatNumber(
                                totalDailyReward.mul(taoPrice.data || 0),
                                {
                                    decimalPlaces: 2,
                                }
                            )}
                            )
                        </span>
                    )
                }
            />
            <ColdkeyInfoTableAttribute
                label="Total Stake"
                render={() =>
                    taoPrice.loading ? (
                        <Spinner small />
                    ) : (
                        <span>
                            {NETWORK_CONFIG.currency}
                            {formatNumber(totalStake, {
                                decimalPlaces: 2,
                            })}
                            &nbsp; ($
                            {formatNumber(totalStake.mul(taoPrice.data || 0), {
                                decimalPlaces: 2,
                            })}
                            )
                        </span>
                    )
                }
            />
        </InfoTable>
    );
};
