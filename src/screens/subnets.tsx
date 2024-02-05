/** @jsxImportSource @emotion/react */

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { Card } from "../components/Card";
import { useState } from "react";
import SubnetsTable from "../components/subnets/SubnetsTable";
import { useSubnets } from "../hooks/useSubnets";
import { SubnetsOrder } from "../services/subnetsService";
import { useSubnetEmissionsHistory } from "../hooks/useSubnetEmissionsHistory";
import { SubnetEmissionsHistoryChart } from "../components/subnets/SubnetEmissionsHistoryChart";

export const SubnetsPage = () => {
	const subnetsInitialOrder: SubnetsOrder = "NET_UID_ASC";
	const [subnetSort, setSubnetSort] =
		useState<SubnetsOrder>(subnetsInitialOrder);
	const subnets = useSubnets(undefined, subnetSort);
	const subnetEmissionsHistory = useSubnetEmissionsHistory();

	useDOMEventTrigger(
		"data-loaded",
		!subnets.loading && !subnetEmissionsHistory.loading
	);

	return (
		<>
			<Card data-test="subnets-history-chart">
				<SubnetEmissionsHistoryChart subnetHistory={subnetEmissionsHistory} />
			</Card>
			<Card data-test="subnets-table">
				<SubnetsTable
					subnets={subnets}
					onSortChange={(sortKey: SubnetsOrder) => setSubnetSort(sortKey)}
					initialSort={subnetsInitialOrder}
				/>
			</Card>
		</>
	);
};
