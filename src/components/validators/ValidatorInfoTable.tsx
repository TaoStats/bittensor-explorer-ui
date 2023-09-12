/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { NETWORK_CONFIG } from "../../config";
import { Currency } from "../Currency";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { useTotalIssuance } from "../../hooks/useTotalIssuance";
import { rawAmountToDecimal } from "../../utils/number";

const addressItem = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export type ValidatorInfoTableProps = {
	account: string;
	balance: any;
};

const ValidatorInfoTableAttribute = InfoTableAttribute<any>;

export const ValidatorInfoTable = (props: ValidatorInfoTableProps) => {
	const { account, balance } = props;

	const { currency } = NETWORK_CONFIG;

	const totalIssuance = useTotalIssuance();
	const dominance =
	balance.loading || totalIssuance === undefined
		? 0
		: (
			(rawAmountToDecimal(balance.data).toNumber() /
			totalIssuance.toNumber()) * 100
		).toFixed(2);

	return (
		<InfoTable
			data={props}
			loading={balance.loading}
			notFound={balance.notFound}
			notFoundMessage="No validator found"
			error={balance.error}
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
		</InfoTable>
	);
};
