/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";
import verifiedDelegates from "../delegates.json";
import { DelegateInfo } from "../model/delegate";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useDelegates } from "../hooks/useDelegates";
import { useDelegateBalances } from "../hooks/useDelegateBalances";
import { useValidatorBalance } from "../hooks/useValidatorBalance";
import { Card, CardHeader } from "../components/Card";
import { ValidatorInfoTable } from "../components/validators/ValidatorInfoTable";
import { TabPane, TabbedContent } from "../components/TabbedContent";
import DelegatesTable from "../components/delegates/DelegatesTable";
import {
	DelegateBalancesOrder,
	DelegatesOrder,
} from "../services/delegateService";
import { useState } from "react";
import NominatorsTable from "../components/validators/NominatorsTable";
import { css, Theme } from "@emotion/react";

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

export type ValidatorPageParams = {
	address: string;
};

export const ValidatorPage = () => {
	const { address } = useParams() as ValidatorPageParams;
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[address];

	const balance = useValidatorBalance({ delegate: { equalTo: address } });

	const nominatorsInitialOrder: DelegateBalancesOrder = "AMOUNT_DESC";
	const [nominatorSort, setNominatorSort] = useState<DelegateBalancesOrder>(
		nominatorsInitialOrder
	);
	const nominators = useDelegateBalances(
		{ delegate: { equalTo: address }, amount: { greaterThan: 1000000 } },
		nominatorSort
	);

	const delegatesInitialOrder: DelegatesOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(
		delegatesInitialOrder
	);
	const delegates = useDelegates(
		{ delegate: { equalTo: address }, amount: { greaterThan: 1000000 } },
		delegateSort
	);

	useDOMEventTrigger(
		"data-loaded",
		!balance.loading && !nominators.loading && !delegates.loading
	);

	return (
		<>
			<Card>
				<CardHeader css={validatorHeader}>
					<div css={validatorTitle}>Validator</div>
					<div css={validatorAddress}>{info?.name ?? address}</div>
				</CardHeader>
				<ValidatorInfoTable account={address} balance={balance} />
			</Card>
			<Card>
				<TabbedContent>
					<TabPane
						label='Nominator'
						count={nominators.pagination.totalCount}
						loading={nominators.loading}
						error={nominators.error}
						value='nominator'
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
						label='Delegation'
						count={delegates.pagination.totalCount}
						loading={delegates.loading}
						error={delegates.error}
						value='delegation'
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
