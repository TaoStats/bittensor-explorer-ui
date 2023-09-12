/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";
import verifiedDelegates from "../delegates.json";
import { DelegateInfo } from "../model/delegate";

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
	DelegatesOrder,
} from "../services/delegateService";
import { useState } from "react";
import WebSvg from "../assets/web.svg";
import NominatorsTable from "../components/validators/NominatorsTable";
import { css, Theme } from "@emotion/react";
import { StatItem } from "../components/network/StatItem";
import { useTaoPrice } from "../hooks/useTaoPrice";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { useBalance } from "../hooks/useBalance";
import { MIN_DELEGATION_AMOUNT } from "../config";
import { ButtonLink } from "../components/ButtonLink";
import { useColdKey } from "../hooks/useColdKey";
import { useValidatorStaked } from "../hooks/useValidatorStaked";
import { rawAmountToDecimal } from "../utils/number";

const validatorHeader = (theme: Theme) => css`
  display: flex;
  gap: 4px;
  align-items: center;
  word-break: keep-all;
  color: ${theme.palette.text.primary};
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
  padding: 0 5px;
  font-weight: 500;
  line-height: 22px;
  margin-left: 10px;
`;

const website = css`
  line-height: 18px;
  margin-left: 5px;
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

const summary = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export type ValidatorPageParams = {
	address: string;
};

export const ValidatorPage = () => {
	const { address } = useParams() as ValidatorPageParams;
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[address];

	const taoPrice = useTaoPrice();

	const coldKey = useColdKey(address);
	const validatorStaked = useValidatorStaked(address, coldKey);

	const validatorBalance = useBalance({ address: { equalTo: address } });

	const balance = useValidatorBalance({ delegate: { equalTo: address } });

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
	const delegates = useDelegates(
		{
			delegate: { equalTo: address },
			amount: { greaterThan: MIN_DELEGATION_AMOUNT },
		},
		delegateSort
	);

	useDOMEventTrigger(
		"data-loaded",
		!balance.loading && !nominators.loading && !delegates.loading
	);

	const navigateToAbsolutePath = (path: any) => {
		let url;

		if (path.startsWith("http://") || path.startsWith("https://")) {
			url = path;
		} else {
			url = "https://" + path;
		}

		window.open(url, "_blank");
	};

	return (
		<>
			<CardRow>
				<Card>
					<CardHeader css={validatorHeader}>
						<div css={validatorTitle}>Validator</div>
						{info?.name ? (
							<>
								<div css={validatorAddress}>{info?.name}</div>
								<span css={verifiedBadge}>verified</span>
								{info?.url && (
									<img
										src={WebSvg}
										css={website}
										onClick={() => navigateToAbsolutePath(info?.url)}
									/>
								)}
							</>
						) : (
							<div css={validatorAddress}>{address}</div>
						)}
					</CardHeader>
					{info?.description && (
						<div css={validatorDescription}>{info?.description}</div>
					)}
					<ValidatorInfoTable account={address} balance={balance} />
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
					<div css={summary}>
						<StatItem title="Delegated" value={1} />
						<StatItem title="Free" value={1} />
					</div>
					<AccountPortfolio balance={validatorBalance} taoPrice={taoPrice} />
				</Card>
			</CardRow>
			<Card>
				<TabbedContent>
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
						/>
					</TabPane>
				</TabbedContent>
			</Card>
		</>
	);
};
