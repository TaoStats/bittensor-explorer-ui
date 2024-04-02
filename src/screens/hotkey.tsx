/** @jsxImportSource @emotion/react */
import { Navigate, useParams } from "react-router-dom";
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
import { useVerifiedDelegates } from "../hooks/useVerifiedDelegates";

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
	display: flex;
	flex-direction: column;
	gap: 25px;
	margin-top: 30px;
`;

const netStyle = css`
	display: flex;
	flex-direction: row;
	gap: 25px;
`;

const netItemStyle = css`
	display: flex;
	flex-direction: column;
`;

const netItemLabelStyle = (theme: Theme) => css`
	font-size: 13px;
	color: ${theme.palette.secondary.dark};
	min-width: 35px;
	display: flex;
	flex-direction: row;
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

	const verifiedDelegates = useVerifiedDelegates();
	if (verifiedDelegates[hkey]) {
		return <Navigate to={`/validator/${hkey}`} replace />;
	}

	return (
		<>
			<div css={hotkeyStyle}>
				<span css={labelStyle}>Hotkey: </span>
				<div css={valueStyle}>
					{hkey}
					<CopyToClipboardButton value={hkey} bg="white" size="small" />
				</div>
			</div>
			<div css={hotkeyStyle}>
				<span css={labelStyle}>Account: </span>
				<div css={valueStyle}>
					<Link href={`/account/${hkey}`} color="white" target="_self">
						/account/{hkey} ▶
					</Link>
				</div>
			</div>
			{coldkey && (
				<div css={hotkeyStyle}>
					<span css={labelStyle}>Coldkey: </span>
					<div css={valueStyle}>
						{coldkey}
						<CopyToClipboardButton value={coldkey} bg="white" size="small" />
					</div>
				</div>
			)}
			<div css={netsStyle}>
				{neuronMetagraph.data.map((meta, index) => (
					<div css={netStyle} key={`metagraph_${index}`}>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>NetUID</span>
							<span css={netItemValueStyle}>{meta.netUid}</span>
						</div>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>Position</span>
							<span css={netItemValueStyle}>{meta.rank}</span>
						</div>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>UID</span>
							<span css={netItemValueStyle}>{meta.uid}</span>
						</div>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>Daily Rewards</span>
							<span css={netItemValueStyle}>
								{formatNumber(rawAmountToDecimal(meta.dailyReward.toString()), {
									decimalPlaces: 3,
								})}
								{NETWORK_CONFIG.currency}
							</span>
						</div>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>
								Updated
								<InfoTooltip
									place="bottom"
									value="This is a performance metric that shows the last time that weights were set on the chain by this hotkey. A higher value over 500 indicates a longer than optimum time to perform this action, which can be an early sign of validator or chain issues if experienced across multiple UIDs. Sustained numbers above 500 for longer periods of time require attention."
								/>
							</span>
							<span css={netItemValueStyle}>
								{chainStats
									? parseInt(chainStats.blocksFinalized.toString()) -
									meta.lastUpdate
									: 0}
							</span>
						</div>
						<div css={netItemStyle}>
							<span css={netItemLabelStyle}>Axon</span>
							<span css={netItemValueStyle}>
								{numberToIP(parseInt(meta.axonIp.toString()))}
							</span>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
