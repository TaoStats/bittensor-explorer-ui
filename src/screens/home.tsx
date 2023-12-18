/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Card, CardRow } from "../components/Card";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import DelegatesTable from "../components/delegates/DelegatesTable";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { NetworkStats, TokenDistributionChart } from "../components/network";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useEffect, useMemo, useState } from "react";
import { BlocksOrder } from "../services/blocksService";
import { BalancesFilter, BalancesOrder } from "../services/balancesService";
import { TransfersFilter, TransfersOrder } from "../services/transfersService";
import { useDelegates } from "../hooks/useDelegates";
import { DelegateFilter, DelegatesOrder } from "../services/delegateService";
import { useLocation } from "react-router-dom";
import { MIN_DELEGATION_AMOUNT } from "../config";
import { useVerifiedDelegates } from "../hooks/useVerifiedDelegates";
import { useValidators } from "../hooks/useValidators";
import ValidatorsTable from "../components/validators/ValidatorsTable";
import { ValidatorsOrder } from "../services/validatorService";
import SubnetsTable from "../components/subnets/SubnetsTable";
import { useSubnets } from "../hooks/useSubnets";
import { SubnetsOrder } from "../services/subnetsService";

const contentStyle = css`
  position: relative;
  flex: 1 1 auto;
  min-height: var(--content-min-height);
`;

const contentInner = css`
  box-sizing: border-box;
  max-width: 1800px;
  margin: 0 auto;
  margin-top: 64px;
  margin-bottom: 48px;
`;

const statsContainer = css`
  flex-grow: 1;
  min-height: 400px;
`;

const chartContainer = css`
  width: 400px;
  flex-grow: 0;
  @media only screen and (max-width: 767px) {
    flex-grow: 1;
    width: auto;
  }
`;

const infoSection = css`
  display: flex;
  @media only screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

export const HomePage = () => {
	const verifiedDelegates = useVerifiedDelegates();

	const blocksInitialOrder: BlocksOrder = "HEIGHT_DESC";
	const [blockSort, setBlockSort] = useState<BlocksOrder>(blocksInitialOrder);
	const blocks = useBlocks(undefined, blockSort);

	const balancesInitialOrder: BalancesOrder = "BALANCE_TOTAL_DESC";
	const [balanceSort, setBalanceSort] =
    useState<BalancesOrder>(balancesInitialOrder);
	const balancesInitialFilter: BalancesFilter = {
		balanceTotal: { greaterThan: 0 },
	};
	const [balanceFilter, setBalanceFilter] = useState<BalancesFilter>(
		balancesInitialFilter
	);
	const balancesInitialSearch = "";
	const [balanceSearch, setBalanceSearch] = useState<string | undefined>(
		balancesInitialSearch
	);
	const balances = useBalances(
		{
			address: {
				includesInsensitive: balanceSearch,
			},
			...balanceFilter,
		},
		balanceSort
	);

	const transfersInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [transferSort, setTransferSort] = useState<TransfersOrder>(
		transfersInitialOrder
	);
	const transfersInitialFilter: TransfersFilter = {
		amount: { greaterThan: 0 },
	};
	const [transfersFilter, setTransfersFilter] = useState<TransfersFilter>(
		transfersInitialFilter
	);
	const transfers = useTransfers(transfersFilter, transferSort);

	const delegatesInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(
		delegatesInitialOrder
	);
	const delegatesInitialFilter: DelegateFilter = {
		amount: { greaterThan: MIN_DELEGATION_AMOUNT },
	};
	const [delegatesFilter, setDelegatesFilter] = useState<DelegateFilter>(
		delegatesInitialFilter
	);
	const delegatesInitialSearch = "";
	const [delegatesSearch, setDelegatesSearch] = useState<string | undefined>(
		delegatesInitialSearch
	);
	const delegateSearchFilter = useMemo(() => {
		const lowerSearch = delegatesSearch?.trim().toLowerCase() || "";
		if (verifiedDelegates !== undefined) {
			const filtered = Object.keys(verifiedDelegates).filter(
				(hotkey: string) => {
					const delegateInfo = verifiedDelegates[hotkey];
					const delegateName = delegateInfo?.name.trim().toLowerCase() || "";
					if (lowerSearch !== "" && delegateName.includes(lowerSearch))
						return true;
					return false;
				}
			);
			if (filtered.length > 0) {
				return {
					delegate: {
						in: filtered,
					},
				};
			}
		}
		if (lowerSearch === "") return {};
		return {
			delegate: {
				includesInsensitive: delegatesSearch,
			},
		};
	}, [delegatesSearch]);
	const delegates = useDelegates(
		{
			...delegateSearchFilter,
			...delegatesFilter,
		},
		delegateSort
	);

	const validatorsInitialOrder: ValidatorsOrder = "AMOUNT_DESC";
	const [validatorsSort, setValidatorsSort] = useState<ValidatorsOrder>(
		validatorsInitialOrder
	);
	const validators = useValidators(validatorsSort);

	const subnetsInitialOrder: SubnetsOrder = "NET_UID_ASC";
	const [subnetSort, setSubnetSort] = useState<SubnetsOrder>(subnetsInitialOrder);
	const subnets = useSubnets(undefined, subnetSort);

	useEffect(() => {
		if (blocks.pagination.page === 1) {
			const id = setInterval(
				() => blocks.refetch && blocks.refetch(),
				12 * 1000
			);
			return () => clearInterval(id);
		}
	}, [blocks]);

	useEffect(() => {
		if (transfers.pagination.page === 1) {
			const id = setInterval(
				() => transfers.refetch && transfers.refetch(),
				12 * 1000
			);
			return () => clearInterval(id);
		}
	}, [transfers]);

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
		<div css={contentStyle}>
			<div css={contentInner}>
				<CardRow css={infoSection}>
					<Card css={statsContainer}>
						<NetworkStats />
					</Card>
				</CardRow>
				<Card>
					<TabbedContent defaultTab={tab.slice(1).toString()}>
						<TabPane
							label="Blocks"
							count={blocks.pagination.totalCount}
							loading={blocks.loading}
							error={blocks.error}
							value="blocks"
						>
							<BlocksTable
								blocks={blocks}
								showTime
								onSortChange={(sortKey: BlocksOrder) => setBlockSort(sortKey)}
								initialSort={blocksInitialOrder}
							/>
						</TabPane>
						<TabPane
							label="Transfers"
							count={transfers.pagination.totalCount}
							loading={transfers.loading}
							error={transfers.error}
							value="transfers"
						>
							<TransfersTable
								transfers={transfers}
								showTime
								onSortChange={(sortKey: TransfersOrder) =>
									setTransferSort(sortKey)
								}
								initialSort={transfersInitialOrder}
								onFilterChange={(newFilter?: TransfersFilter) =>
									setTransfersFilter({ ...transfersFilter, ...newFilter })
								}
								initialFilter={transfersInitialFilter}
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
								onSearchChange={(newSearch?: string) =>
									setDelegatesSearch(newSearch)
								}
								initialSearch={delegatesInitialSearch}
							/>
						</TabPane>
						<TabPane
							label="Validators"
							loading={validators.loading}
							error={!!validators.error}
							value="validators"
						>
							<ValidatorsTable
								validators={validators}
								onSortChange={(sortKey: ValidatorsOrder) =>
									setValidatorsSort(sortKey)
								}
								initialSort={validatorsInitialOrder}
							/>
						</TabPane>
						<TabPane
							label="Accounts"
							count={balances.pagination.totalCount}
							loading={balances.loading}
							error={balances.error}
							value="accounts"
						>
							<BalancesTable
								balances={balances}
								onSortChange={(sortKey: BalancesOrder) =>
									setBalanceSort(sortKey)
								}
								initialSort={balancesInitialOrder}
								onFilterChange={(newFilter?: BalancesFilter) =>
									setBalanceFilter({ ...balanceFilter, ...newFilter })
								}
								initialFilter={balancesInitialFilter}
								onSearchChange={(newSearch?: string) =>
									setBalanceSearch(newSearch)
								}
								initialSearch={balancesInitialSearch}
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
								onSortChange={(sortKey: SubnetsOrder) => setSubnetSort(sortKey)}
								initialSort={subnetsInitialOrder}
							/>
						</TabPane>
					</TabbedContent>
				</Card>
			</div>
		</div>
	);
};
