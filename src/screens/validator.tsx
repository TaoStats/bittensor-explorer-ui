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
import { useEffect, useMemo, useState } from "react";
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
	@media only screen and (max-width: 767px) {
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
	grid-template-columns: repeat(4, 1fr);
	gap: 5px;
`;
const neuronBox = css`
	border: 1px solid white;
	padding: 5px;
`;
const statFourItems = css`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 2fr;
`;
const statTwoItems = css`
	display: grid;
	grid-template-columns: 3fr 2fr;
`;
const statBreak = css`
	margin-top: 15px;
`;

const stakeButton = css`
	padding: 20px;
`;

const portfolioStyle = (theme: Theme) => css`
	flex: 0 0 auto;
	width: 400px;

	${theme.breakpoints.down("lg")} {
		width: auto;
	}
`;

const perfContainer = css`
	margin-top: 50px;
`;

const perfSubnet = css`
	font-size: 14px;
	min-width: 32px;
	height: 32px;
	background: rgba(255, 255, 255, 0.06);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 2px;
	padding: 0 8px;
	margin: 5px 10px;
	cursor: pointer;
`;

const activePerfSubnet = css`
	box-shadow: 0 0 8px 0 #ff990085 inset;
`;

export type ValidatorPageParams = {
	address: string;
};

export const ValidatorPage = () => {
	const { address } = useParams() as ValidatorPageParams;

	const validator = useValidator({ address: { equalTo: address } });

	const verifiedDelegates = useVerifiedDelegates();

	const info = verifiedDelegates[address];

	const balance = useValidatorBalance({ address: { equalTo: address } });
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

	const neuronMetagraph = useNeuronMetagraph({
		hotkey: { equalTo: address },
	});
	const {
		state: { chainStats },
	} = useAppStats();

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
	const subnetIDs = useMemo(() => {
		const ids: number[] = validator.data?.validatorPermits || [];
		const firstId = ids[0] ?? -1;
		if (activeSubnet === -1 && firstId !== -1) setActiveSubnet(firstId);
		return ids;
	}, [validator]);

	return validator.notFound ? (
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
										onClick={() => navigateToAbsolutePath(info?.url)}
									/>
								)}
							</div>
						) : (
							<div css={validatorAddress}>{address}</div>
						)}
					</CardHeader>
					{info?.description && (
						<div css={validatorDescription}>{info?.description}</div>
					)}
					<ValidatorInfoTable
						account={address}
						balance={balance}
						info={validator}
					/>
					<div css={neuronBoxes}>
						{neuronMetagraph.data?.map((meta) => (
							<div css={neuronBox}>
								<div css={statFourItems}>
									<span>SN</span>
									<span>Pos</span>
									<span>UID</span>
									<span>Axon</span>
								</div>
								<div css={statFourItems}>
									<span>{meta.netUid}</span>
									<span>{meta.rank}</span>
									<span>{meta.uid}</span>
									<span>{shortenIP(meta.axonIp)}</span>
								</div>
								<div css={[statTwoItems, statBreak]}>
									<span>Daily Rewards</span>
									<span>Dividends</span>
								</div>
								<div css={statTwoItems}>
									<span>
										{NETWORK_CONFIG.currency}
										{formatNumber(
											rawAmountToDecimal(meta.dailyReward.toString()),
											{
												decimalPlaces: 2,
											}
										)}
									</span>
									<span>
										{formatNumber(rawAmountToDecimalBy(meta.dividends, 65535), {
											decimalPlaces: 5,
										})}
									</span>
								</div>
								<div css={[statTwoItems, statBreak]}>
									<span>Updated</span>
									<span>vTrust</span>
								</div>
								<div css={statTwoItems}>
									<span>
										{chainStats ? parseInt(chainStats.blocksFinalized.toString()) - meta.lastUpdate : 0}
									</span>
									<span>
										{formatNumber(
											rawAmountToDecimalBy(meta.validatorTrust, 65535),
											{
												decimalPlaces: 5,
											}
										)}
									</span>
								</div>
							</div>
						))}
					</div>
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
				<TabbedContent>
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
							<div>
								{subnetIDs.map((id: number) => (
									<div
										css={[
											perfSubnet,
											id === activeSubnet ? activePerfSubnet : undefined,
										]}
										key={`perf_subnet_${id}`}
										onClick={() => setActiveSubnet(id)}
									>
										{id}
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
								setDelegatesFilter({ ...delegatesFilter, ...newFilter })
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
