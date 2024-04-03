/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NeuronMetagraphTable from "./NeuronMetagraphTable";
import { useNeuronMetagraph } from "../../hooks/useNeuronMetagraph";
import { useState } from "react";
import { NeuronMetagraphOrder } from "../../services/subnetsService";

const containerCss = css`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const subnetTitleCss = css`
	color: white;
`;

type ColdkeySubnetsProps = {
	netUid: number;
	coldkey: string;
};

export const ColdkeySubnets = ({ netUid, coldkey }: ColdkeySubnetsProps) => {
	const neuronMetagraphInitialOrder: NeuronMetagraphOrder = "STAKE_DESC";
	const [neuronMetagraphSort, setNeuronMetagraphSort] =
		useState<NeuronMetagraphOrder>(neuronMetagraphInitialOrder);
	const metagraphInitialSearch = "";
	const [searchText, setSearchText] = useState<string | undefined>(
		metagraphInitialSearch
	);
	const neuronMetagraph = useNeuronMetagraph(
		{
			netUid: { equalTo: netUid },
			coldkey: { equalTo: coldkey },
			or: [
				{
					hotkey: {
						includesInsensitive: searchText,
					},
				},
			],
		},
		neuronMetagraphSort
	);

	return (
		<div css={containerCss}>
			<h2 css={subnetTitleCss}>Subnet {netUid}</h2>
			<NeuronMetagraphTable
				metagraph={neuronMetagraph}
				onSortChange={(sortKey: NeuronMetagraphOrder) =>
					setNeuronMetagraphSort(sortKey)
				}
				initialSort={neuronMetagraphInitialOrder}
				onSearchChange={(newSearch?: string) => setSearchText(newSearch)}
				initialSearch={metagraphInitialSearch}
			/>
		</div>
	);
};
