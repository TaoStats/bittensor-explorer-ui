/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { NETWORK_CONFIG } from "../../config";
import { Currency } from "../Currency";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { rawAmountToDecimal } from "../../utils/number";
import { useAppStats } from "../../contexts";
import { Resource } from "../../model/resource";
import { Validator } from "../../model/validator";
import { AccountAddress } from "../AccountAddress";

const addressItem = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export type ValidatorInfoTableProps = {
	account: string;
	balance: any;
	info: Resource<Validator>;
};

const ValidatorInfoTableAttribute = InfoTableAttribute<any>;

export const ValidatorInfoTable = (props: ValidatorInfoTableProps) => {
	const { account, balance, info } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const {
		state: { tokenLoading, tokenStats },
	} = useAppStats();
	const dominance =
		tokenLoading || tokenStats === undefined || tokenStats.delegatedSupply === 0
			? 0
			: (
				(rawAmountToDecimal(balance.data).toNumber() /
				tokenStats.delegatedSupply) *
			100
			).toFixed(2);

	return (
		<InfoTable
			data={props}
			loading={balance.loading || info.loading}
			notFound={balance.notFound || info.notFound}
			notFoundMessage="No validator found"
			error={balance.error || info.error}
		>
			<ValidatorInfoTableAttribute
				label="Hotkey"
				render={() => <div css={addressItem}>{account}</div>}
				copyToClipboard={() => account}
			/>
			<ValidatorInfoTableAttribute
				label="Staked Amount"
				render={() => (
					<Currency
						amount={balance.data}
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>
			<ValidatorInfoTableAttribute
				label="Dominance"
				render={() => <div>{dominance}%</div>}
			/>
			<ValidatorInfoTableAttribute
				label="Owner"
				render={() => (
					<AccountAddress address={info.data?.owner || ""} prefix={prefix} link />
				)}
			/>
		</InfoTable>
	);
};
