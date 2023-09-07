import { NETWORK_CONFIG } from "../../config";
import { Currency } from "../Currency";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

export type ValidatorInfoTableProps = {
	account: string;
	balance: any;
};

const ValidatorInfoTableAttribute = InfoTableAttribute<any>;

export const ValidatorInfoTable = (props: ValidatorInfoTableProps) => {
	const { balance } = props;

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
				label="Account"	
				render={(data) => data.account}
				copyToClipboard={(data) => data.account}
			/>
			<ValidatorInfoTableAttribute
				label="Total balance"
				render={(data) => (
					<Currency
						amount={data.balance.data}
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>
		</InfoTable>
	);
};
