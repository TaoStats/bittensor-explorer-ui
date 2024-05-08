/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";
import { Card } from "../components/Card";
import { Link } from "../components/Link";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { TokenomicsChart } from "../components/tokenomics/TokenomicsChart";
import { NETWORK_CONFIG } from "../config";
import { useAppStats } from "../contexts";
import { formatNumber, rawAmountToDecimal } from "../utils/number";
import { HalveningChart } from "../components/tokenomics/HalveningChart";

const defaultText = (theme: Theme) => css`
	color: ${theme.palette.secondary.dark};
`;

const header = css`
	font-size: 19px;
	color: white;
	margin: 25px 0;
`;

const supplyInfo = css`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
`;
const supplyText = css`
	font-size: 13px;
`;

const smallLayout = css`
	width: 63%;
`;

const description = css`
	font-size: 14px;
	margin-top: 15px;
`;

const whiteText = css`
	color: #fff;
`;

const stakingDataBlock = css`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	margin-top: 40px;
`;

const stakingDataBox = css`
	padding: 0 35px 0 0;
	label {
		font-size: 13px;
	}
`;

export const TokenomicsPage = () => {
	const {
		state: { chainStats: chain, chainLoading: chainStatsLoading },
	} = useAppStats();

	const loading = chainStatsLoading;

	if (loading) return <Loading />;
	if (chain === undefined) {
		return <NotFound>Stats not found.</NotFound>;
	}

	const totalSupply = rawAmountToDecimal("21000000000000000");
	const circulatingSupply = rawAmountToDecimal(chain.issued.toString());
	const unissued = totalSupply.minus(circulatingSupply);
	const stakedCirculatingSupply = rawAmountToDecimal(chain.staked.toString());
	const freeCirculatingSupply = circulatingSupply.minus(
		stakedCirculatingSupply
	);
	const circulationPercent = circulatingSupply.mul(100).div(totalSupply);
	const blocksPerHalvening = 10500000;
	const secondsPerHalvening = 126000000;
	const blocks = Math.floor(blocksPerHalvening - circulatingSupply.toNumber());

	const halveningData: any = [
		{
			label: "CURR",
			total: formatNumber(circulatingSupply, { decimalPlaces: 0 }),
			issue: formatNumber(circulatingSupply, { decimalPlaces: 0 }),
			reward: "1",
			blocks,
			duration: blocks * 12,
			time: Math.floor(Date.now() / 1000),
		},
		{
			label: "H1",
			total: "10,500,000",
			issue: "10,500,000",
			reward: "0.5",
		},
		{
			label: "H2",
			total: "15,750,000",
			issue: "5,250,000",
			reward: "0.25",
		},
		{
			label: "H3",
			total: "18,375,000",
			issue: "2,625,000",
			reward: "0.125",
		},
		{
			label: "H4",
			total: "19,687,500",
			issue: "1,312,500",
			reward: "0.0625",
		},
		{
			label: "H5",
			total: "20,343,750",
			issue: "656,250",
			reward: "0.03125",
		},
		{
			label: "H6",
			total: "20,671,875",
			issue: "328,125",
			reward: "0.015625",
		},
		{
			label: "H7",
			total: "20,835,937.5",
			issue: "164,062.5",
			reward: "0.0078125",
		},
		{
			label: "H8",
			total: "20,917,968.75",
			issue: "82,031.25",
			reward: "0.00390625",
		},
		{
			label: "H9",
			total: "20,958,984.375",
			issue: "41,015.625",
			reward: "0.001953125",
		},
		{
			label: "H10",
			total: "20,979,492.1875",
			issue: "20,507.8125",
			reward: "0.0009765625",
		},
		{
			label: "H11",
			total: "20,989,746.09375",
			issue: "10,253.90625",
			reward: "0.00048828125",
		},
		{
			label: "H12",
			total: "20,994,873.046875",
			issue: "5,126.953125",
			reward: "0.000244140625",
		},
	];
	for (let i = 1; i < halveningData.length; i++) {
		halveningData[i].blocks = blocksPerHalvening;
		halveningData[i].duration = secondsPerHalvening;
		halveningData[i].time =
			halveningData[i - 1].time + halveningData[i - 1].duration;
	}

	const dateFormatOptions: any = {
		day: "2-digit",
		month: "long",
		year: "numeric",
	};

	return (
		<>
			<Card css={defaultText}>
				<div css={header}>SUPPLY DATA</div>
				<div css={supplyInfo}>
					<span css={supplyText}>Ciculating Supply</span>
					<span css={whiteText}>
						{formatNumber(circulatingSupply, { decimalPlaces: 0 })}
						{NETWORK_CONFIG.currency}
					</span>
				</div>
				<div css={supplyInfo}>
					<span css={supplyText}>Total Supply</span>
					<span css={whiteText}>
						{formatNumber(totalSupply, { decimalPlaces: 0 })}
						{NETWORK_CONFIG.currency}
					</span>
				</div>
				<div css={smallLayout}>
					<TokenomicsChart
						totalSupply={totalSupply}
						circulatingSupply={circulatingSupply}
						unissued={unissued}
						stakedCirculatingSupply={stakedCirculatingSupply}
						freeCirculatingSupply={freeCirculatingSupply}
					/>
					<div css={description}>
						There was an initial iteration of the network name{" "}
						<Link
							color="#fff"
							to="https://kx.taostats.io/?_gl=1*1f9kngf*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNTE2MDgxOS4xMy4xLjE3MTUxNjE4MjQuMC4wLjA."
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Kusangi
						</Link>{" "}
						which was started on the 3rd January 2021 and then halted in the
						middle of May so that some issues could be addressed. The blockchain
						and all 546,113 previously mined TAO were migrated to{" "}
						<Link
							color="#fff"
							to="https://nx.taostats.io/?_gl=1*1w69ouk*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNTE2MDgxOS4xMy4xLjE3MTUxNjE4MjQuMC4wLjA."
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Nakamoto
						</Link>{" "}
						which was started on 2nd November 2021 from block 0. The Finney
						network network was officially launched on the 20th March 2023.
					</div>
					<div css={description}>
						The total token issuance rather than the block number is used to
						determine the exact point the halvening occurs. As Tao used to
						recycle registrations is burned back into the unissued supply, there
						is a lengthening halvening data however this data is calculated at
						the current block/issuance so will update automatically over time.
					</div>
					<div css={description}>
						The total issuance used in Taostats is taken directly from the
						substrate blockchain.
					</div>
				</div>

				<div css={stakingDataBlock}>
					<div css={stakingDataBox}>
						<label>Next Halvening</label>
						<div css={whiteText}>
							{new Date(halveningData[1].time * 1000).toLocaleDateString(
								"en-US",
								dateFormatOptions
							)}
						</div>
					</div>
					<div css={stakingDataBox}>
						<label>Circulating Supply</label>
						<div css={whiteText}>
							{formatNumber(circulatingSupply, { decimalPlaces: 0 })}
							{NETWORK_CONFIG.currency}
						</div>
					</div>
					<div css={stakingDataBox}>
						<label>Total Supply</label>
						<div css={whiteText}>
							{formatNumber(totalSupply, { decimalPlaces: 0 })}
							{NETWORK_CONFIG.currency}
						</div>
					</div>
					<div css={stakingDataBox}>
						<label>In Circulation</label>
						<div css={whiteText}>
							{formatNumber(circulationPercent, { decimalPlaces: 2 })}%
						</div>
					</div>
				</div>
				<HalveningChart halveningData={halveningData} />
				<div css={smallLayout}>
					<div css={description}>
						The total supply of 21 million is pre-programmed. A block is mined
						about every 12 seconds, rewarding the miners and validators with 1
						TAO per block. At the current inflation schedule this leads to 7200
						new TAO being issued into circulation every 24 hours which is
						currently split evenly between miners and validators.
					</div>
					<div css={description}>
						Once half of the supply has been issued the rate of issuance is
						halved — with 12 seconds per block that amounts to a halving every 4
						years. Every half marker of the remaining amount to be issued
						creates a new halvening event until all 21 million TAO are in
						circulation.
					</div>
				</div>

				<div css={header}>HALVENING DATA</div>
				<table className="table table-striped" width="100%">
					<thead>
						<tr>
							<th></th>
							<th>Total in Circulation (τ)</th>
							<th>Issued this H (τ)</th>
							<th>Block Reward (τ)</th>
							<th>Duration (blocks)</th>
							<th>Duration (s)</th>
							<th>Time (epoch)</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{halveningData.map((data: any) => (
							<tr>
								<td>{data.label}</td>
								<td>{data.total}</td>
								<td>{data.issue}</td>
								<td>{data.reward}</td>
								<td>{formatNumber(data.blocks, { decimalPlaces: 0 })}</td>
								<td>{formatNumber(data.duration, { decimalPlaces: 0 })}</td>
								<td>{data.time}</td>
								<td>
									{new Date(data.time * 1000).toLocaleDateString(
										"en-US",
										dateFormatOptions
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Card>
		</>
	);
};
