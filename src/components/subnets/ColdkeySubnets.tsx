/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NeuronMetagraphTable from "./NeuronMetagraphTable";
import { useNeuronMetagraph } from "../../hooks/useNeuronMetagraph";
import { useState } from "react";
import { NeuronMetagraphOrder } from "../../services/subnetsService";
import { Link } from "../Link";

const containerCss = css`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const subnetTitleCss = css`
	text-decoration: underline;
`;

type ColdkeySubnetsProps = {
	netUid: number;
	coldkey: string;
};

export const ColdkeySubnets = ({ netUid, coldkey }: ColdkeySubnetsProps) => {
	const neuronMetagraphInitialOrder: NeuronMetagraphOrder = "STAKE_DESC";
	const [neuronMetagraphSort, setNeuronMetagraphSort] =
		useState<NeuronMetagraphOrder>(neuronMetagraphInitialOrder);
	const neuronMetagraph = useNeuronMetagraph(
		{
			netUid: { equalTo: netUid },
			coldkey: { equalTo: coldkey },
		},
		neuronMetagraphSort
	);

	return (
		<div css={containerCss}>
			<h2 css={subnetTitleCss}>
				<Link to={`/subnet/${netUid}`} color="white">
					Subnet {netUid}
				</Link>
			</h2>
			<NeuronMetagraphTable
				metagraph={neuronMetagraph}
				onSortChange={(sortKey: NeuronMetagraphOrder) =>
					setNeuronMetagraphSort(sortKey)
				}
				initialSort={neuronMetagraphInitialOrder}
				showAll={true}
			/>
		</div>
	);
};
