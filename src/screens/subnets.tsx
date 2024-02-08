/** @jsxImportSource @emotion/react */

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { Card } from "../components/Card";
import { useEffect, useState } from "react";
import SubnetsTable from "../components/subnets/SubnetsTable";
import { useSubnets } from "../hooks/useSubnets";
import { SubnetsOrder } from "../services/subnetsService";
import { useSubnetsHistory } from "../hooks/useSubnetsHistory";
import { SubnetEmissionsHistoryChart } from "../components/subnets/SubnetEmissionsHistoryChart";
import { useLocation } from "react-router-dom";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { SubnetRaoRecycledHistoryChart } from "../components/subnets/SubnetRaoRecycledHistoryChart";

export const SubnetsPage = () => {
	const subnetsInitialOrder: SubnetsOrder = "EMISSION_DESC";
	const [subnetSort, setSubnetSort] =
		useState<SubnetsOrder>(subnetsInitialOrder);
	const subnets = useSubnets(undefined, subnetSort);
	const subnetEmissionsHistory = useSubnetsHistory();

	useDOMEventTrigger(
		"data-loaded",
		!subnets.loading && !subnetEmissionsHistory.loading
	);

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
			<Card data-test="subnets-history-chart">
				<TabbedContent defaultTab={tab.slice(1).toString()}>
					<TabPane
						label="Emissions"
						loading={subnetEmissionsHistory.loading}
						error={!!subnetEmissionsHistory.error}
						value="emissions"
					>
						<SubnetEmissionsHistoryChart
							subnetHistory={subnetEmissionsHistory}
						/>
					</TabPane>
					<TabPane
						label="Rao Recycled"
						loading={subnetEmissionsHistory.loading}
						error={!!subnetEmissionsHistory.error}
						value="recycled"
					>
						<SubnetRaoRecycledHistoryChart
							subnetHistory={subnetEmissionsHistory}
						/>
					</TabPane>
				</TabbedContent>
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
