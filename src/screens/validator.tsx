/** @jsxImportSource @emotion/react */
import { useLocation, useParams } from "react-router-dom";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useDelegates } from "../hooks/useDelegates";
import { useDelegateBalances } from "../hooks/useDelegateBalances";
import { useValidatorBalance } from "../hooks/useValidatorBalance";
import { Card, CardHeader, CardRow } from "../components/Card";
import { ValidatorInfoTable } from "../components/validators/ValidatorInfoTable";
import { TabPane, TabbedContent } from "../components/TabbedContent";
import DelegatesTable from "../components/delegates/DelegatesTable";
import {
	DelegateBalancesOrder,
	DelegateFilter,
	DelegatesOrder,
} from "../services/delegateService";
import { useEffect, useState } from "react";
import WebSvg from "../assets/web.svg";
import NominatorsTable from "../components/validators/NominatorsTable";
import { css, Theme } from "@emotion/react";
import { MIN_DELEGATION_AMOUNT, NETWORK_CONFIG } from "../config";
import { ButtonLink } from "../components/ButtonLink";
import { ValidatorPortfolio } from "../components/validators/ValidatorPortfolio";
import { ValidatorStakeHistoryChart } from "../components/validators/ValidatorStakeHistoryChart";
import { useValidatorStakeHistory } from "../hooks/useValidatorHistory";
import { useVerifiedDelegates } from "../hooks/useVerifiedDelegates";
import { useValidator } from "../hooks/useValidator";
import { useSubnets } from "../hooks/useSubnets";
import SubnetsTable from "../components/validators/SubnetsTable";
import { HotkeyPerformanceChart } from "../components/hotkey/HotkeyPerformanceChart";
import { useNeuronMetagraph } from "../hooks/useNeuronMetagraph";
import {
	formatNumber,
	rawAmountToDecimal,
	rawAmountToDecimalBy,
	shortenIP,
} from "../utils/number";
import { useAppStats } from "../contexts";
import { useValidator7DayMA } from "../hooks/useValidators7DayMA";
import { Validator7DayMAChart } from "../components/validators/Validator7DayMAChart";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

const validatorHeader = (theme: Theme) => css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    word-break: keep-all;
    color: ${theme.palette.text.primary};
`;

const infoSection = css`
    display: flex;
    @media only screen and (max-width: 1139px) {
        flex-direction: column;
    }
`;

const validatorInfo = css`
    display: flex;
    gap: 10px;
`;

const validatorAddress = css`
    opacity: 0.5;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const validatorTitle = css`
    display: block;
    opacity: 0.8;
    width: 144px;
    font-size: 12px;
`;

const verifiedBadge = css`
    background-color: #7aff97;
    color: #000;
    font-size: 10px;
    text-transform: uppercase;
    padding: 5px;
    font-weight: 500;
`;

const website = css`
    line-height: 18px;
    cursor: pointer;
`;

const validatorDescription = css`
    padding: 0px 20px 20px;
    display: block;
    opacity: 0.8;
    font-size: 12px;
`;

const neuronBoxes = css`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
    @media only screen and (max-width: 1779px) {
        grid-template-columns: repeat(7, 1fr);
    }
    @media only screen and (max-width: 1569px) {
        grid-template-columns: repeat(6, 1fr);
    }
    @media only screen and (max-width: 1339px) {
        grid-template-columns: repeat(5, 1fr);
    }
    @media only screen and (max-width: 1199px) {
        grid-template-columns: repeat(4, 1fr);
    }
    @media only screen and (max-width: 991px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media only screen and (max-width: 767px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;
const neuronBox = css`
    border: 1px solid gray;
    padding: 10px 0 10px 10px;
    cursor: pointer;

    &:hover {
        border-color: white;
    }

    @media only screen and (max-width: 429px) {
        padding: 5px 0 5px 5px;
    }
`;
const selectedNeuronBox = css`
    border-color: #14dec2 !important;
`;
const statRow = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;
const statBigLabel = css`
    font-size: 26px;
    line-height: 26px;
    color: #fa9b00;
`;
const statFullWidth = css`
    flex: 1;
`;
const statThreeItems = css`
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    margin: 2px 0;
`;
const statTwoItems = css`
    display: grid;
    grid-template-columns: 3fr 2fr;
    margin: 2px 0;
`;
const statLabel = css`
    color: gray;
    font-size: 11px;
    line-height: 11px;
    @media only screen and (max-width: 429px) {
        font-size: 9px;
        line-height: 9px;
    }
`;
const statValue = css`
    color: #fff;
    font-size: 13px;
    line-height: 13px;
    @media only screen and (max-width: 429px) {
        font-size: 11px;
        line-height: 11px;
    }
`;
const statWarning = css`
    color: #ff7a7a;
`;
const statBreak = css`
    margin-top: 5px;
`;

const stakeButton = css`
    padding: 20px;
`;

const portfolioStyle = (theme: Theme) => css`
    flex: 0 0 auto !important;
    width: 400px;

    ${theme.breakpoints.down("lg")} {
        width: auto;
    }
`;

const perfContainer = css`
    margin-top: 50px;
`;

export type ValidatorPageParams = {
	address: string;
};

export const ValidatorPage = () => {
	const { address } = useParams() as ValidatorPageParams;

	const validator = useValidator({ address: { equalTo: address } });
	const {
		state: { chainStats },
	} = useAppStats();

	const verifiedDelegates = useVerifiedDelegates();
	const extrinsics = useExtrinsics(
		{ signer: { equalTo: address } },
		"BLOCK_HEIGHT_DESC"
	);

	const info = verifiedDelegates[address];

	const balance = useValidatorBalance({ address: { equalTo: address } });
	const {
		state: { tokenLoading, tokenStats },
	} = useAppStats();
	const dominance =
		tokenLoading ||
			tokenStats === undefined ||
			tokenStats.delegatedSupply === 0
			? 0
			: rawAmountToDecimal(balance.data).toNumber() /
			tokenStats.delegatedSupply;

	const validatorStakeHistory = useValidatorStakeHistory(address);

	const nominatorsInitialOrder: DelegateBalancesOrder = "AMOUNT_DESC";
	const [nominatorSort, setNominatorSort] = useState<DelegateBalancesOrder>(
		nominatorsInitialOrder
	);
	const nominators = useDelegateBalances(
		{
			delegate: { equalTo: address },
			amount: { greaterThan: MIN_DELEGATION_AMOUNT },
		},
		nominatorSort
	);

	const delegatesInitialOrder: DelegatesOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(
		delegatesInitialOrder
	);
	const delegatesInitialFilter: DelegateFilter = {
		amount: { greaterThan: MIN_DELEGATION_AMOUNT },
	};
	const [delegatesFilter, setDelegatesFilter] = useState<DelegateFilter>(
		delegatesInitialFilter
	);
	const delegates = useDelegates(
		{
			delegate: { equalTo: address },
			...delegatesFilter,
		},
		delegateSort
	);

	const neuronMetagraph = useNeuronMetagraph(
		{
			hotkey: { equalTo: address },
			netUid: { notEqualTo: 0 },
		},
		1024,
		"NET_UID_ASC"
	);

	useEffect(() => {
		const interval = setInterval(neuronMetagraph.refetch, 12 * 1000);
		return () => clearInterval(interval);
	}, [neuronMetagraph]);

	useDOMEventTrigger(
		"data-loaded",
		!balance.loading && !nominators.loading && !delegates.loading
	);

	const navigateToAbsolutePath = (path: string) => {
		let url;

		if (path.startsWith("http://") || path.startsWith("https://")) {
			url = path;
		} else {
			url = "https://" + path;
		}

		window.open(url, "_blank");
	};

	const { hash: tab } = useLocation();
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	const subnets = useSubnets(undefined);

	const [activeSubnet, setActiveSubnet] = useState(-1);
	useEffect(() => {
		const firstId = neuronMetagraph.data?.at(0)?.netUid || -1;
		if (activeSubnet === -1 && firstId !== -1) setActiveSubnet(firstId);
	}, [neuronMetagraph]);

	const sevenDaysMA = useValidator7DayMA(address);

	return validator.notFound ||
		validator.data === undefined ||
		(chainStats !== undefined &&
			validator.data.height <
			Number(chainStats.blocksFinalized) - 7200) ? (
		<CardRow css={infoSection}>
			<Card>Invalid validator address</Card>
		</CardRow>
	) : (
		<>
			<CardRow css={infoSection}>
				<Card>
					<CardHeader css={validatorHeader}>
						<div css={validatorTitle}>Validator</div>
						{info?.name ? (
							<div css={validatorInfo}>
								<div css={validatorAddress}>{info?.name}</div>
								<div>
									<span css={verifiedBadge}>verified</span>
								</div>
								{info?.url && (
									<img
										src={WebSvg}
										css={website}
										onClick={() =>
											navigateToAbsolutePath(info?.url)
										}
									/>
								)}
							</div>
						) : (
							<div css={validatorAddress}>{address}</div>
						)}
					</CardHeader>
					{info?.description && (
						<div css={validatorDescription}>
							{info?.description}
						</div>
					)}
					<ValidatorInfoTable
						account={address}
						balance={balance}
						info={validator}
					/>
					<div css={stakeButton}>
						<ButtonLink
							to={`https://delegate.taostats.io/staking?hkey=${address}`}
							size="small"
							variant="outlined"
							color="secondary"
							target="_blank"
						>
							DELEGATE STAKE
						</ButtonLink>
					</div>
				</Card>
				<Card css={portfolioStyle} data-test="account-portfolio">
					<ValidatorPortfolio hotkey={address} info={validator} />
				</Card>
			</CardRow>
			<Card data-test="account-historical-items">
				<TabbedContent defaultTab={tab.slice(1).toString()}>
					<TabPane
						label="Staked"
						loading={validatorStakeHistory.loading}
						error={!!validatorStakeHistory.error}
						value="staked"
					>
						<ValidatorStakeHistoryChart
							account={address}
							stakeHistory={validatorStakeHistory}
							balance={balance}
						/>
					</TabPane>
					<TabPane
						label="Performance"
						loading={validator.loading}
						error={!!validator.error}
						value="performance"
					>
						<div css={perfContainer}>
							<div css={neuronBoxes}>
								{neuronMetagraph.data?.map((meta) => (
									<div
										css={[
											neuronBox,
											meta.netUid === activeSubnet
												? selectedNeuronBox
												: undefined,
										]}
										onClick={() =>
											setActiveSubnet(meta.netUid)
										}
										key={`validator_performance_subnet_${meta.netUid}`}
									>
										<div css={statRow}>
											<div css={statBigLabel}>
												{meta.netUid}
											</div>
											<div css={statFullWidth}>
												<div css={statThreeItems}>
													<span css={statLabel}>
														Pos
													</span>
													<span css={statLabel}>
														UID
													</span>
													<span css={statLabel}>
														Axon
													</span>
												</div>
												<div css={statThreeItems}>
													<span css={statValue}>
														{meta.rank}
													</span>
													<span css={statValue}>
														{meta.uid}
													</span>
													<span css={statValue}>
														{shortenIP(meta.axonIp)}
													</span>
												</div>
											</div>
										</div>
										<div css={[statTwoItems, statBreak]}>
											<span css={statLabel}>
												Daily Rewards
											</span>
											<span css={statLabel}>
												Dividends
											</span>
										</div>
										<div css={statTwoItems}>
											<span css={statValue}>
												{NETWORK_CONFIG.currency}
												{formatNumber(
													rawAmountToDecimal(
														meta.dailyReward.toString()
													),
													{
														decimalPlaces: 2,
													}
												)}
											</span>
											<span
												css={[
													statValue,
													rawAmountToDecimalBy(
														meta.dividends,
														65535
													).lessThan(dominance)
														? statWarning
														: undefined,
												]}
											>
												{formatNumber(
													rawAmountToDecimalBy(
														meta.dividends,
														65535
													),
													{
														decimalPlaces: 5,
													}
												)}
											</span>
										</div>
										<div css={[statTwoItems, statBreak]}>
											<span css={statLabel}>Updated</span>
											<span css={statLabel}>vTrust</span>
										</div>
										<div css={statTwoItems}>
											<span
												css={[
													statValue,
													meta.updated > 1000
														? statWarning
														: undefined,
												]}
											>
												{meta.updated}
											</span>
											<span css={statValue}>
												{formatNumber(
													rawAmountToDecimalBy(
														meta.validatorTrust,
														65535
													),
													{
														decimalPlaces: 5,
													}
												)}
											</span>
										</div>
									</div>
								))}
							</div>
							{activeSubnet > -1 && (
								<HotkeyPerformanceChart
									netUid={activeSubnet}
									hotkey={address}
								/>
							)}
						</div>
					</TabPane>
					<TabPane
						label="Reward"
						loading={sevenDaysMA.loading}
						error={!!sevenDaysMA.error}
						value="reward"
					>
						<Validator7DayMAChart
							address={address}
							movingAverage={sevenDaysMA}
						/>
					</TabPane>
				</TabbedContent>
			</Card>
			<Card>
				<TabbedContent defaultTab={tab.slice(1).toString()}>
					<TabPane
						label="Nominator"
						count={nominators.pagination.totalCount}
						loading={nominators.loading}
						error={nominators.error}
						value="nominator"
					>
						<NominatorsTable
							nominators={nominators}
							onSortChange={(sortKey: DelegateBalancesOrder) =>
								setNominatorSort(sortKey)
							}
							initialSort={nominatorSort}
							address={info?.name ?? address}
							download
						/>
					</TabPane>
					<TabPane
						label="Extrinsics"
						count={extrinsics.pagination.totalCount}
						loading={extrinsics.loading}
						error={extrinsics.error}
						value="extrinsics"
					>
						<ExtrinsicsTable extrinsics={extrinsics} showTime />
					</TabPane>
					<TabPane
						label="Delegation"
						count={delegates.pagination.totalCount}
						loading={delegates.loading}
						error={delegates.error}
						value="delegation"
					>
						<DelegatesTable
							delegates={delegates}
							showTime
							onSortChange={(sortKey: DelegatesOrder) =>
								setDelegateSort(sortKey)
							}
							initialSort={delegatesInitialOrder}
							onFilterChange={(newFilter?: DelegateFilter) =>
								setDelegatesFilter({
									...delegatesFilter,
									...newFilter,
								})
							}
							initialFilter={delegatesInitialFilter}
							address={info?.name ?? address}
							download
							fromValidator
						/>
					</TabPane>
					<TabPane
						label="Subnets"
						count={subnets.pagination.totalCount}
						loading={subnets.loading}
						error={subnets.error}
						value="subnets"
					>
						<SubnetsTable
							subnets={subnets}
							registrations={validator.data?.registrations}
							validatorPermits={validator.data?.validatorPermits}
						/>
					</TabPane>
				</TabbedContent>
			</Card>
		</>
	);
};
