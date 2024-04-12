/** @jsxImportSource @emotion/react */
import { Navigate, useParams } from "react-router-dom";
import { css } from "@emotion/react";
import { useHotkeyNet } from "../hooks/useHotkeyNet";
import { rawAmountToDecimal } from "../utils/number";
import { useMemo, useState } from "react";
import { Card } from "../components/Card";
import { HotkeyInfoTable } from "../components/hotkey/HotkeyInfoTable";
import { HotkeyPerformanceChart } from "../components/hotkey/HotkeyPerformanceChart";
import HotkeyMetagraphTable from "../components/hotkey/HotkeyMetagraphTable";

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

export type HotkeyPageParams = {
	hkey: string;
};

export const HotkeyPage = () => {
	const { hkey } = useParams() as HotkeyPageParams;

	const neuronMetagraph = useHotkeyNet(hkey);
	const isValidator = useMemo(() => {
		if (neuronMetagraph.loading) return false;
		return (
			neuronMetagraph.data.find(
				(cur) =>
					cur.dividends > 0 && rawAmountToDecimal(cur.stake.toString()).gt(1000)
			) != undefined
		);
	}, [neuronMetagraph]);

	const [activeSubnet, setActiveSubnet] = useState(-1);
	const subnetIDs = useMemo(() => {
		if (neuronMetagraph.loading) return [];
		const ids = neuronMetagraph.data
			.map(({ netUid }) => netUid)
			.filter((id) => id > 0);
		const firstId = ids[0] ?? -1;
		if (activeSubnet === -1 && firstId !== -1) setActiveSubnet(firstId);
		return ids;
	}, [neuronMetagraph]);

	if (isValidator) {
		return <Navigate to={`/validator/${hkey}`} replace />;
	}

	return (
		<>
			<Card>
				<HotkeyInfoTable hotkey={hkey} {...neuronMetagraph} />
			</Card>
			<Card>
				<HotkeyMetagraphTable {...neuronMetagraph} />
			</Card>
			<Card>
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
								SN{id}
							</div>
						))}
					</div>
					{activeSubnet > -1 && (
						<HotkeyPerformanceChart netUid={activeSubnet} hotkey={hkey} />
					)}
				</div>
			</Card>
		</>
	);
};
