/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { css } from "@emotion/react";
import { ValidatorsOrder } from "../services";
import {
    useDOMEventTrigger,
    useValidators,
    useValidatorsStakeHistory,
} from "../hooks";
import {
    Card,
    Link,
    ValidatorsStakeHistoryChart,
    ValidatorsTable,
} from "../components";

const toggleStyle = css`
    margin-bottom: 20px;
    display: none;
`;

const header = css`
    font-size: 19px;
    color: white;
`;

const smallLayout = css`
    font-size: 14px;
    margin-top: 15px;
`;

export const ValidatorsPage = () => {
    const validatorsInitialOrder: ValidatorsOrder = "AMOUNT_DESC";
    const [validatorsSort, setValidatorsSort] = useState<ValidatorsOrder>(
        validatorsInitialOrder
    );
    const validators = useValidators(validatorsSort);
    const [weightCopiers, setWeightCopiers] = useState(false);
    const validatorsStakeHistory = useValidatorsStakeHistory(weightCopiers);

    useDOMEventTrigger(
        "data-loaded",
        !validators.loading && !validatorsStakeHistory.loading
    );

    return (
        <>
            <Card>
                <div css={header}>VALIDATORS</div>
                <div css={smallLayout}>
                    The charts below use live chain data to show current
                    performance of validators. <br />
                    It should be noted that this data can fluctuate greatly from
                    epoch to epoch and should not be used as a measure of long
                    term validator performance, it is a metric of current
                    performance only. <br />
                    The top chart plots this data over a 7 day period, however
                    in order to give a more accurate understanding of delegation
                    returns, our <Link href="/staking">
                        Staking Calculator
                    </Link>{" "}
                    uses a 30 day moving average derived from these values over
                    a longer time frame to show a more accurate evaluation of
                    long term validator performance.
                </div>
            </Card>
            <Card data-test="validators-history-chart">
                <div css={toggleStyle} className="toggle_btn_block">
                    <div className="on-off-toggle">
                        <input
                            className="on-off-toggle__input"
                            type="checkbox"
                            id="toggle_switch"
                            onChange={(e) => setWeightCopiers(e.target.checked)}
                        />
                        <label
                            htmlFor="toggle_switch"
                            className="on-off-toggle__slider"
                        ></label>
                    </div>
                    <span>Weight Copiers</span>
                </div>
                <ValidatorsStakeHistoryChart
                    stakeHistory={validatorsStakeHistory}
                />
            </Card>
            <Card data-test="validators-table">
                <ValidatorsTable
                    validators={validators}
                    onSortChange={(sortKey: ValidatorsOrder) =>
                        setValidatorsSort(sortKey)
                    }
                    initialSort={validatorsInitialOrder}
                />
            </Card>
        </>
    );
};
