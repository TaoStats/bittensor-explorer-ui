/** @jsxImportSource @emotion/react */
import { useMemo, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Theme, css } from "@emotion/react";
import subnetsJson from "../subnets.json";
import CheckShield from "../assets/check-shield.svg";
import Certification from "../assets/certification.svg";
import {
    Card,
    CardHeader,
    SubnetInfoTable,
    SubnetStatItem,
    TabbedContent,
    TabPane,
    NeuronRegistrationChart,
    Spinner,
    NeuronDeregistrationChart,
    MinerIncentiveDistributionChart,
    MinerColdkeyDistributionChart,
    MinerIPDistributionChart,
    SubnetTaoRecycledHistoryChart,
    SubnetTaoRecycled24HHistoryChart,
    NeuronMetagraphTable,
    SubnetHyperparamTable,
    NeuronRegEventsTable,
    MinerColdkeyTable,
    MinerIPTable,
    SubnetOwnersTable,
    RootValidatorsTable,
} from "../components";
import { NETWORK_CONFIG } from "../config";
import {
    useSubnet,
    useSingleSubnetStat,
    useSubnetHistory,
    useSubnetOwners,
    useNeuronRegCostHistory,
    useNeuronDeregistrations,
    useNeuronMetagraph,
    useNeuronRegEvents,
    useMinerIncentive,
    useMinerColdkeys,
    useMinerIPs,
    usePaginatedMinerColdkeys,
    usePaginatedMinerIPs,
    useSubnetHyperparams,
    useRootValidators,
    useDOMEventTrigger,
} from "../hooks";
import {
    NeuronMetagraphOrder,
    NeuronRegEventsOrder,
    MinerIPOrder,
    MinerColdkeyOrder,
    RootValidatorOrder,
} from "../services";
import {
    rawAmountToDecimal,
    containsOnlyDigits,
    isIPFormat,
    nFormatter,
    formatNumber,
} from "../utils";

const subnetHeader = (theme: Theme) => css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    word-break: keep-all;
    color: ${theme.palette.text.primary};
    padding-bottom: 20px;
`;

const subnetName = css`
    font-size: 28px;
`;

const subnetDescription = css`
    padding: 0px 20px 20px;
    display: block;
    opacity: 0.8;
    font-size: 12px;
`;

const statItems = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
    @media only screen and (max-width: 1399px) {
        width: 100%;
    }
    padding-left: 20px;
`;

const statItemsRow = css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    @media only screen and (max-width: 1199px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media only screen and (max-width: 767px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

const metagraphStyle = css`
    margin: 64px 0;
`;

const regCostContainerStyle = () => css`
    display: flex;
    flex-direction: row;

    & > div:first-of-type {
        flex: 1;
    }
`;

const regCostValueStyle = (theme: Theme) => css`
    display: flex;
    flex-direction: column;
    width: 225px;
    gap: 10px;
    margin-left: 24px;
    padding-left: 24px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);

    & > span:nth-of-type(odd) {
        font-size: 13px;
        color: ${theme.palette.secondary.dark};
    }
`;

const metagraphComment = () => css`
    font-size: 13px;
    margin-bottom: 25px;
`;

const regEventsTable = () => css`
    margin-top: 50px;
    font-size: 19px;
`;

const distributionHeader = () => css`
    margin-top: 50px;
    margin-left: -20px;
    font-size: 19px;
`;

const regEventsDescription = css`
    font-size: 14px;
    margin-top: -45px;
    margin-bottom: 25px;
    margin-left: 20px;
`;

const regEventsTotal = (theme: Theme) => css`
    color: ${theme.palette.success.main};
`;

const validatorComment = () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
`;

export type SubnetPageParams = {
    id: string;
};

export const SubnetPage = () => {
    const { id } = useParams() as SubnetPageParams;
    const subnetObj = (subnetsJson as any)[id] ?? {};
    const subnet = useSubnet({ id: { equalTo: id } });
    const subnetStat = useSingleSubnetStat({
        netUid: { equalTo: parseInt(id) },
    });
    const subnetsHistory = useSubnetHistory(id);
    const subnetOwners = useSubnetOwners(id);
    const neuronRegCostHistory = useNeuronRegCostHistory(id);
    const neuronDeregistrations = useNeuronDeregistrations(id);
    const [lastDeRegEmission, lastDeRegIncentive] = useMemo(() => {
        const { data } = neuronDeregistrations;
        if (!data) return [0, 0];
        const emission = data.at(-1)?.emission || BigInt(0);
        const incentive = data.at(-1)?.incentive || 0;
        return [
            rawAmountToDecimal(emission.toString()).toNumber(),
            incentive / 65535,
        ];
    }, [neuronDeregistrations]);

    const neuronMetagraphInitialOrder: NeuronMetagraphOrder = "STAKE_DESC";
    const [neuronMetagraphSort, setNeuronMetagraphSort] =
        useState<NeuronMetagraphOrder>(neuronMetagraphInitialOrder);
    const metagraphInitialSearch = "";
    const [searchText, setSearchText] = useState<string | undefined>(
        metagraphInitialSearch
    );

    const getSearchQuery = (search: string) => {
        const searchText = search.trim();
        const query = [];

        // Search by hotkey
        query.push({
            hotkey: {
                includesInsensitive: searchText,
            },
        });

        // Search by coldkey
        query.push({
            coldkey: {
                includesInsensitive: searchText,
            },
        });

        // If the string is an integer, search by UID
        if (containsOnlyDigits(searchText)) {
            query.push({ uid: { equalTo: parseInt(searchText) } });
        }

        // If the string is a valid IP string
        if (isIPFormat(searchText)) {
            query.push({ axonIp: { includesInsensitive: searchText } });
        }

        return query;
    };

    const neuronMetagraph = useNeuronMetagraph(
        {
            netUid: { equalTo: parseInt(id) },
            ...(searchText ? { or: getSearchQuery(searchText) } : {}),
        },
        25,
        neuronMetagraphSort
    );

    const [regEventsFrom, setRegEventsFrom] = useState("");
    useEffect(() => {
        const now = Date.now();
        const from = new Date(now - 24 * 60 * 60 * 1000).toISOString();
        setRegEventsFrom(from);
    }, []);
    const neuronRegEventsInitialOrder: NeuronRegEventsOrder = "TIMESTAMP_DESC";
    const [neuronRegEventsSort, setNeuronRegEventsSort] =
        useState<NeuronRegEventsOrder>(neuronRegEventsInitialOrder);
    const neuronRegEvents = useNeuronRegEvents(
        {
            netUid: { equalTo: parseInt(id) },
            timestamp: { greaterThan: regEventsFrom },
        },
        neuronRegEventsSort
    );

    const minerIncentive = useMinerIncentive(id);
    const minerColdkeys = useMinerColdkeys(id);
    const minerIPs = useMinerIPs(id);

    const minerColdkeyInitialOrder: MinerIPOrder = "MINERS_COUNT_DESC";
    const [minerColdkeySort, setMinerColdkeySort] = useState<MinerIPOrder>(
        minerColdkeyInitialOrder
    );
    const paginatedMinerColdkeys = usePaginatedMinerColdkeys(
        {
            netUid: { equalTo: parseInt(id) },
        },
        minerColdkeySort
    );
    const minerIPInitialOrder: MinerIPOrder = "MINERS_COUNT_DESC";
    const [minerIPSort, setMinerIPSort] =
        useState<MinerIPOrder>(minerIPInitialOrder);
    const paginatedMinerIPs = usePaginatedMinerIPs(
        {
            netUid: { equalTo: parseInt(id) },
        },
        minerIPSort
    );

    const subnetHyperparams = useSubnetHyperparams({
        netUid: { equalTo: parseInt(id) },
    });

    useDOMEventTrigger("data-loaded", !subnet.loading);

    const { hash: tab } = useLocation();
    useEffect(() => {
        if (tab) {
            document.getElementById(tab)?.scrollIntoView();
            window.scrollBy(0, -175);
        } else {
            window.scrollTo(0, 0);
        }
    }, [tab]);

    return (
        <>
            <Card data-test="subnet-info">
                <CardHeader css={subnetHeader}>
                    <div css={subnetName}>
                        {id} : {subnetObj.name || "Unknown"}
                    </div>
                </CardHeader>
                <div css={subnetDescription}>{subnetObj.description}</div>
                <SubnetInfoTable info={subnet} additional={subnetObj} />
                <div css={statItems}>
                    <div css={statItemsRow}>
                        <SubnetStatItem
                            title="Emissions"
                            value={`${formatNumber(
                                rawAmountToDecimal(
                                    subnet?.data?.emission
                                ).toNumber() * 100,
                                {
                                    decimalPlaces: 2,
                                }
                            )}%`}
                        />
                        <SubnetStatItem
                            title="Recycled"
                            value={`${formatNumber(
                                rawAmountToDecimal(
                                    subnet.data?.recycledByOwner?.toString()
                                ).toNumber(),
                                {
                                    decimalPlaces: 2,
                                }
                            )}
						${NETWORK_CONFIG.currency}`}
                        />
                        <SubnetStatItem
                            title="Recycled (24h)"
                            value={`${formatNumber(
                                rawAmountToDecimal(
                                    subnet.data?.recycled24H?.toString()
                                ).toNumber(),
                                {
                                    decimalPlaces: 2,
                                }
                            )}
						${NETWORK_CONFIG.currency}`}
                        />
                        <SubnetStatItem
                            title="Registration Cost"
                            value={`${formatNumber(
                                rawAmountToDecimal(
                                    subnetStat.data?.regCost?.toString()
                                ).toNumber(),
                                {
                                    decimalPlaces: 2,
                                }
                            )}
						${NETWORK_CONFIG.currency}`}
                        />
                    </div>
                    <div css={statItemsRow}>
                        <SubnetStatItem
                            title="Active Keys"
                            value={subnetStat?.data?.activeKeys}
                            total={subnetStat?.data?.maxNeurons}
                        />
                        <SubnetStatItem
                            title="Active Validators"
                            value={subnetStat?.data?.activeValidators}
                            total={subnetStat?.data?.validators}
                        />
                        <SubnetStatItem
                            title="Active Miners"
                            value={subnetStat?.data?.activeMiners}
                            total={subnetStat?.data?.maxNeurons}
                        />
                        <SubnetStatItem
                            title="Active Dual Miners/Validators"
                            value={subnetStat?.data?.activeDual}
                            total={subnetStat?.data?.validators}
                        />
                    </div>
                </div>
            </Card>
            <div css={metagraphStyle}>
                <TabbedContent defaultTab={tab.slice(1).toString()} noPadding>
                    <TabPane
                        label="Metagraph"
                        loading={neuronMetagraph.loading}
                        error={!!neuronMetagraph.error}
                        value="metagraph"
                    >
                        <div css={metagraphComment}>
                            <div>Click on any UID for detailed stats.</div>
                            <div css={validatorComment}>
                                <img src={CheckShield} />
                                <span>are validators.</span>
                            </div>
                            <div css={validatorComment}>
                                <img src={Certification} />
                                <span>are keys in immunity.</span>
                            </div>
                        </div>
                        <NeuronMetagraphTable
                            metagraph={neuronMetagraph}
                            onSortChange={(sortKey: NeuronMetagraphOrder) =>
                                setNeuronMetagraphSort(sortKey)
                            }
                            initialSort={neuronMetagraphInitialOrder}
                            onSearchChange={(newSearch?: string) =>
                                setSearchText(newSearch)
                            }
                            initialSearch={metagraphInitialSearch}
                        />
                    </TabPane>
                    <TabPane
                        label="Hyperparams"
                        loading={subnetHyperparams.loading}
                        error={subnetHyperparams.error}
                        value="hyperparams"
                    >
                        <SubnetHyperparamTable
                            hyperparams={subnetHyperparams}
                        />
                    </TabPane>
                    <TabPane
                        label="Registration"
                        loading={neuronRegCostHistory.loading}
                        error={!!neuronRegCostHistory.error}
                        value="registration"
                    >
                        <CardHeader css={regEventsTable}>
                            REGISTRATION DATA
                        </CardHeader>
                        <div css={regCostContainerStyle}>
                            <NeuronRegistrationChart
                                neuronRegCostHistory={neuronRegCostHistory}
                                subnetStat={subnetStat}
                            />
                            {subnet.loading ? (
                                <Spinner small />
                            ) : (
                                <div css={regCostValueStyle}>
                                    <span>Current Registration Cost</span>
                                    <span>
                                        {formatNumber(
                                            rawAmountToDecimal(
                                                subnetStat.data?.regCost?.toString()
                                            ).toNumber(),
                                            {
                                                decimalPlaces: 2,
                                            }
                                        )}
                                        {NETWORK_CONFIG.currency}
                                    </span>
                                </div>
                            )}
                        </div>
                        <CardHeader css={regEventsTable}>
                            DE-REGISTRATION DATA
                        </CardHeader>
                        <div css={regCostContainerStyle}>
                            <NeuronDeregistrationChart
                                neuronDeregistrations={neuronDeregistrations}
                            />
                            {subnet.loading ? (
                                <Spinner small />
                            ) : (
                                <div css={regCostValueStyle}>
                                    <span>Last De-registration Emission</span>
                                    <span>
                                        {nFormatter(lastDeRegEmission, 6)}
                                    </span>
                                    <span>Last De-registration Incentive</span>
                                    <span>
                                        {nFormatter(lastDeRegIncentive, 6)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <CardHeader css={regEventsTable}>
                            REGISTRATIONS TABLE
                        </CardHeader>
                        <div css={regEventsDescription}>
                            <span css={regEventsTotal}>
                                {neuronRegEvents.pagination.totalCount}
                            </span>{" "}
                            in the last 24 hours.
                        </div>
                        <NeuronRegEventsTable
                            regEvents={neuronRegEvents}
                            onSortChange={(sortKey: NeuronRegEventsOrder) =>
                                setNeuronRegEventsSort(sortKey)
                            }
                            initialSort={neuronRegEventsInitialOrder}
                        />
                    </TabPane>
                    <TabPane
                        label="Distribution"
                        loading={minerIncentive.loading}
                        error={!!minerIncentive.error}
                        value="distribution"
                    >
                        <CardHeader css={distributionHeader}>
                            MINER INCENTIVE DISTRIBUTION
                        </CardHeader>
                        <MinerIncentiveDistributionChart
                            minerIncentive={minerIncentive}
                        />
                        <CardHeader css={distributionHeader}>
                            MINER COLDKEY DISTRIBUTION
                        </CardHeader>
                        <MinerColdkeyDistributionChart
                            minerColdkeys={minerColdkeys}
                        />
                        <MinerColdkeyTable
                            minerColdkeys={paginatedMinerColdkeys}
                            onSortChange={(sortKey: MinerColdkeyOrder) =>
                                setMinerColdkeySort(sortKey)
                            }
                            initialSort={minerColdkeyInitialOrder}
                        />
                        <CardHeader css={distributionHeader}>
                            MINER IP DISTRIBUTION
                        </CardHeader>
                        <MinerIPDistributionChart minerIPs={minerIPs} />
                        <MinerIPTable
                            minerIPs={paginatedMinerIPs}
                            onSortChange={(sortKey: MinerIPOrder) =>
                                setMinerIPSort(sortKey)
                            }
                            initialSort={minerIPInitialOrder}
                        />
                    </TabPane>
                </TabbedContent>
            </div>
            <Card data-test="subnet-tables">
                <TabbedContent defaultTab={tab.slice(1).toString()}>
                    <TabPane
                        label="Owners"
                        loading={subnetOwners.loading}
                        error={!!subnetOwners.error}
                        value="owners"
                    >
                        <SubnetOwnersTable subnetOwners={subnetOwners} />
                    </TabPane>
                    <TabPane
                        label="Recycled (Lifetime)"
                        loading={subnetsHistory.loading}
                        error={!!subnetsHistory.error}
                        value="recycled_lifetime"
                    >
                        <SubnetTaoRecycledHistoryChart
                            subnetHistory={subnetsHistory}
                            subnetId={id}
                        />
                    </TabPane>
                    <TabPane
                        label="Recycled (24h)"
                        loading={subnetsHistory.loading}
                        error={!!subnetsHistory.error}
                        value="recycled_24h"
                    >
                        <SubnetTaoRecycled24HHistoryChart
                            subnetHistory={subnetsHistory}
                            subnetId={id}
                        />
                    </TabPane>
                </TabbedContent>
            </Card>
        </>
    );
};

export const RootSubnetPage = () => {
    const id = "0";
    const subnet = useSubnet({ id: { equalTo: id } });

    const rootValidatorsInitialOrder: RootValidatorOrder = "STAKE_DESC";
    const [rootValidatorsSort, setRootValidatorsSort] =
        useState<RootValidatorOrder>(rootValidatorsInitialOrder);
    const rootValidators = useRootValidators(undefined, 10, rootValidatorsSort);

    useDOMEventTrigger("data-loaded", !subnet.loading);

    const { hash: tab } = useLocation();
    useEffect(() => {
        if (tab) {
            document.getElementById(tab)?.scrollIntoView();
            window.scrollBy(0, -175);
        } else {
            window.scrollTo(0, 0);
        }
    }, [tab]);

    return (
        <>
            <Card data-test="subnet-info">
                <CardHeader css={subnetHeader}>
                    <div css={subnetName}>Subnet 0 - Root</div>
                </CardHeader>
                <div css={subnetDescription}>
                    <p>
                        The ‘root’ network is a meta subnet with id 0. This
                        network determines the proportion of the network’s block
                        emission to be distributed to each subnet network. This
                        is currently set to 1 TAO for every block mined.
                    </p>
                    <p>
                        Like other subnetworks, the root network consists of a
                        set of validators that set weights (W). These weights
                        are then processed by Yuma Consensus to determine an
                        emission vector (E). The difference is that the vector E
                        has a length equal to the number of active subnetworks
                        currently running on the chain and each e_i in E is the
                        emission proportion that subnet i receives every block.
                    </p>
                    <p>
                        The root network also doubles as the network senate.
                        This senate is the top 12 keys on this network which
                        have been granted veto power on proposals submitted by
                        the triumvirate.
                    </p>
                </div>
            </Card>
            <div css={metagraphStyle}>
                <TabbedContent defaultTab={tab.slice(1).toString()} noPadding>
                    <TabPane
                        label="Metagraph"
                        loading={rootValidators.loading}
                        error={!!rootValidators.error}
                        value="metagraph"
                    >
                        <RootValidatorsTable
                            rootValidators={rootValidators}
                            onSortChange={(sortKey: RootValidatorOrder) =>
                                setRootValidatorsSort(sortKey)
                            }
                            initialSort={rootValidatorsInitialOrder}
                        />
                    </TabPane>
                </TabbedContent>
            </div>
        </>
    );
};
