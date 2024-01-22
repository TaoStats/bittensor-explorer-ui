/** @jsxImportSource @emotion/react */

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { Card } from "../components/Card";
import { useState } from "react";
import { css } from "@emotion/react";
import SubnetsTable from "../components/subnets/SubnetsTable";
import { useSubnets } from "../hooks/useSubnets";
import { SubnetsOrder } from "../services/subnetsService";

export const SubnetsPage = () => {
	const subnetsInitialOrder: SubnetsOrder = "NET_UID_ASC";
	const [subnetSort, setSubnetSort] =
		useState<SubnetsOrder>(subnetsInitialOrder);
	const subnets = useSubnets(undefined, subnetSort);

	useDOMEventTrigger("data-loaded", !subnets.loading);

	return (
		<>
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
