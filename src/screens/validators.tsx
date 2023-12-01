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
import { useEffect, useRef, useState } from "react";
import WebSvg from "../assets/web.svg";
import NominatorsTable from "../components/validators/NominatorsTable";
import { css, Theme } from "@emotion/react";
import { MIN_DELEGATION_AMOUNT } from "../config";
import { ButtonLink } from "../components/ButtonLink";
import { ValidatorPortfolio } from "../components/validators/ValidatorPortfolio";
import { ValidatorStakeHistoryChart } from "../components/validators/ValidatorStakeHistoryChart";
import { useValidatorStakeHistory } from "../hooks/useValidatorHistory";
import { useVerifiedDelegates } from "../hooks/useVerifiedDelegates";
import { useValidator } from "../hooks/useValidator";

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
	const tabRef = useRef(null);
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
					<ValidatorInfoTable account={address} balance={balance} info={validator} />
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
				<div ref={tabRef}>
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
					</TabbedContent>
				</div>
			</Card>
			<Card>
				<div ref={tabRef}>
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
							/>
						</TabPane>
					</TabbedContent>
				</div>
			</Card>
		</>
	);
};
