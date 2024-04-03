/** @jsxImportSource @emotion/react */
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import Certification from "../assets/certification.svg";
import { useColdKeySubnets } from "../hooks/useColdKeySubnets";
import { ColdkeySubnets } from "../components/subnets/ColdkeySubnets";

const metagraphComment = () => css`
	font-size: 13px;
	margin-bottom: 25px;
`;

const validatorComment = () => css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
`;

const subnetColdkeys = css`
	display: flex;
	flex-direction: column;
	gap: 50px;
`;

export type ColdkeyPageParams = {
	coldkey: string;
};

export const ColdkeyPage = () => {
	const { coldkey } = useParams() as ColdkeyPageParams;
	const subnetIds = useColdKeySubnets({ coldkey: { equalTo: coldkey } });

	useDOMEventTrigger("data-loaded", !subnetIds.loading);

	return (
		<>
			<div css={metagraphComment}>
				<div>Click on any UID for detailed stats.</div>
				<div css={validatorComment}>
					<img src={Certification} />
					<span>are keys in immunity.</span>
				</div>
			</div>
			<div css={subnetColdkeys}>
				{subnetIds.data?.data.map((subnet) => (
					<ColdkeySubnets
						netUid={subnet.netUid}
						coldkey={coldkey}
						key={`coldkey_subnets_${subnet.netUid}`}
					/>
				))}
			</div>
		</>
	);
};
