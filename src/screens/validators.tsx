import { useParams } from "react-router-dom";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useDelegates } from "../hooks/useDelegates";
import { useDelegateBalances } from "../hooks/useDelegateBalances";
import { useValidatorBalance } from "../hooks/useValidatorBalance";
import { Card } from "../components/Card";
import { ValidatorInfoTable } from "../components/validators/ValidatorInfoTable";
import { TabPane, TabbedContent } from "../components/TabbedContent";
import DelegatesTable from "../components/delegates/DelegatesTable";
import { DelegateBalancesOrder, DelegatesOrder } from "../services/delegateService";
import { useState } from "react";
import NominatorsTable from "../components/validators/NominatorsTable";

export type ValidatorPageParams = {
	address: string;
};

export const ValidatorPage = () => {
	const { address } = useParams() as ValidatorPageParams;

	const balance = useValidatorBalance({ delegate: { equalTo: address} });

	const nominatorsInitialOrder: DelegateBalancesOrder = "AMOUNT_DESC";
	const [nominatorSort, setNominatorSort] = useState<DelegateBalancesOrder>(nominatorsInitialOrder);
	const nominators = useDelegateBalances({ delegate: { equalTo: address }, amount: { notEqualTo: 0 } }, nominatorSort);

	const delegatesInitialOrder: DelegatesOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(delegatesInitialOrder);
	const delegates = useDelegates({ delegate: { equalTo: address } }, delegateSort);

	useDOMEventTrigger("data-loaded", !balance.loading && !nominators.loading && !delegates.loading);

	return (
		<>
			<Card>
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
