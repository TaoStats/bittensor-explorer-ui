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
		1024,
		neuronMetagraphSort
	);

	return (
		<div css={containerCss}>
			<h2>
				<Link to={`/subnet/${netUid}`}>Subnet {netUid}</Link>
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
