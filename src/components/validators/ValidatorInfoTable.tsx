/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { NETWORK_CONFIG } from "../../config";
import { Currency } from "../Currency";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

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
		</InfoTable>
	);
};
