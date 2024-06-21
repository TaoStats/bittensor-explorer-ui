/** @jsxImportSource @emotion/react */
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import Certification from "../assets/certification.svg";
import { useColdKeySubnets } from "../hooks/useColdKeySubnets";
import { ColdkeySubnets } from "../components/subnets/ColdkeySubnets";
import { useColdKeyInfo } from "../hooks/useColdKeyInfo";
import { ColdkeyInfoTable } from "../components/subnets/ColdkeyInfoTable";

const metagraphComment = () => css`
	font-size: 13px;
	margin-top: 50px;
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
	margin-top: 50px;
`;

export type ColdkeyPageParams = {
	coldkey: string;
};

export const ColdkeyPage = () => {
	const { coldkey } = useParams() as ColdkeyPageParams;
	const subnetIds = useColdKeySubnets(coldkey);
	const coldkeyInfo = useColdKeyInfo(coldkey);

	useDOMEventTrigger("data-loaded", !subnetIds.loading);

	return (
		<>
			<ColdkeyInfoTable coldkey={coldkey} info={coldkeyInfo} />
			<div css={metagraphComment}>
				<div>Click on any UID for detailed stats.</div>
				<div css={validatorComment}>
					<img src={Certification} />
					<span>are keys in immunity.</span>
				</div>
			</div>
			<div css={subnetColdkeys}>
				{subnetIds.data?.map((netUid) => (
					<ColdkeySubnets
						netUid={netUid}
						coldkey={coldkey}
						key={`coldkey_subnets_${netUid}`}
					/>
				))}
			</div>
		</>
	);
};
