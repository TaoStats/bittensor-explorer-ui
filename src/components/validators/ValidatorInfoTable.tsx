import { NETWORK_CONFIG } from "../../config";
import { Currency } from "../Currency";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { DelegateInfo } from "../../model/delegate";

import verifiedDelegates from "../../delegates.json";

export type ValidatorInfoTableProps = {
	account: string;
	balance: any;
};

const ValidatorInfoTableAttribute = InfoTableAttribute<any>;

export const ValidatorInfoTable = (props: ValidatorInfoTableProps) => {
	const { account, balance } = props;
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[account];

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
				render={() => info?.name ?? account}
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
