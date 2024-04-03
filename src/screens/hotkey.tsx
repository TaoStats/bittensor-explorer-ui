/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";
import { Theme, css } from "@emotion/react";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { Link } from "../components/Link";
import { useHotkeyNet } from "../hooks/useHotkeyNet";
import { formatNumber, numberToIP, rawAmountToDecimal } from "../utils/number";
import { NETWORK_CONFIG } from "../config";
import { useAppStats } from "../contexts";
import { NeuronMetagraph } from "../model/subnet";
import { useMemo } from "react";
import InfoTooltip from "../components/InfoTooltip";
import { BlockTimestamp } from "../components/BlockTimestamp";

const hotkeyStyle = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
	margin: 10px 0;
`;

const labelStyle = (theme: Theme) => css`
	font-size: 14px;
	color: ${theme.palette.secondary.dark};
`;

const valueStyle = css`
	color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
	background-color: #1f1f1f;
	font-size: 13px;
	padding: 3px 7px 2px;
`;

const netsStyle = css`
	margin-top: 30px;
	text-align: left;

	& > tr > th:first-of-type,
	& > tr > td:first-of-type {
		padding-left: 0;
	}
`;

const netItemLabelStyle = (theme: Theme) => css`
	font-size: 13px;
	color: ${theme.palette.secondary.dark};
	min-width: 35px;
`;

const verticalCenterStyle = css`
	display: flex;
	align-items: center;
	gap: 3px;
`;

const netItemValueStyle = css`
	color: white;
	font-size: 15px;
`;

export type HotkeyPageParams = {
	hkey: string;
};

export const HotkeyPage = () => {
	const { hkey } = useParams() as HotkeyPageParams;
	const neuronMetagraph = useHotkeyNet(hkey);
	const coldkey = useMemo(() => {
		if (neuronMetagraph.loading) return undefined;
		return neuronMetagraph.data.reduce(
			(_coldkey: string | undefined, cur: NeuronMetagraph) => cur.coldkey,
			undefined
		);
	}, [neuronMetagraph]);
	const {
		state: { chainStats },
	} = useAppStats();

	return (
		<>
			<div css={hotkeyStyle}>
				<span css={labelStyle}>Hotkey: </span>
				<div css={valueStyle}>
					<Link href={`/account/${hkey}`} color="white" target="_self">
						{hkey} ▶
					</Link>
					<CopyToClipboardButton value={hkey} bg="white" size="small" />
				</div>
			</div>
			{coldkey && (
				<div css={hotkeyStyle}>
					<span css={labelStyle}>Coldkey: </span>
					<div css={valueStyle}>
						<Link href={`/coldkey/${coldkey}`} color="white" target="_self">
							{coldkey} ▶
						</Link>
						<CopyToClipboardButton value={coldkey} bg="white" size="small" />
					</div>
				</div>
			)}
			<table css={netsStyle}>
				<tr>
					<th css={netItemLabelStyle}>NetUID</th>
					<th css={netItemLabelStyle}>Position</th>
					<th css={netItemLabelStyle}>UID</th>
					<th css={netItemLabelStyle}>Registered(UTC)</th>
					<th css={netItemLabelStyle}>Daily Rewards</th>
					<th css={netItemLabelStyle}>Incentive</th>
					<th css={[netItemLabelStyle, verticalCenterStyle]}>
						Updated
						<InfoTooltip
							place="bottom"
							value="This is a performance metric that shows the last time that weights were set on the chain by this hotkey. A higher value over 500 indicates a longer than optimum time to perform this action, which can be an early sign of validator or chain issues if experienced across multiple UIDs. Sustained numbers above 500 for longer periods of time require attention."
						/>
					</th>
					<th css={netItemLabelStyle}>Axon</th>
				</tr>
				{neuronMetagraph.data.map((meta, index) => (
					<tr key={`metagraph_${index}`}>
						<td css={netItemValueStyle}>
							<Link href={`/subnet/${meta.netUid}`} target="_self">
								{meta.netUid}
							</Link>
						</td>
						<td css={netItemValueStyle}>{meta.rank}</td>
						<td css={netItemValueStyle}>{meta.uid}</td>
						<td css={netItemValueStyle}>
							<BlockTimestamp
								blockHeight={meta.registeredAt}
								utc
								timezone={false}
								tooltip
							/>
						</td>
						<td css={netItemValueStyle}>
							{formatNumber(rawAmountToDecimal(meta.dailyReward.toString()), {
								decimalPlaces: 3,
							})}
							{NETWORK_CONFIG.currency}
						</td>
						<td css={netItemValueStyle}>
							{formatNumber(meta.incentive / 65535, {
								decimalPlaces: 5,
							})}
						</td>
						<td css={netItemValueStyle}>
							{chainStats
								? parseInt(chainStats.blocksFinalized.toString()) -
								meta.lastUpdate
								: 0}
						</td>
						<td css={netItemValueStyle}>
							{numberToIP(parseInt(meta.axonIp.toString()))}
						</td>
					</tr>
				))}
			</table>
		</>
	);
};
