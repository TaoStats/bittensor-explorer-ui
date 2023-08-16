/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { decodeAddress, encodeAddress, isEthereumAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Resource } from "../../model/resource";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NETWORK_CONFIG } from "../../config";
import { AccountBalance } from "../../model/balance";
import { formatCurrency, rawAmountToDecimal } from "../../utils/number";
import { u8aToHex } from "@polkadot/util";
import { css } from "@emotion/react";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	info: {
		account: Resource<Account>;
		balance: Resource<AccountBalance>;
		price: number | undefined;
	};
}

const AccountInfoTableAttribute = InfoTableAttribute<Account & AccountBalance>;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const { info: { account, balance, price }, ...tableProps } = props;

	const total = rawAmountToDecimal(balance.data?.total.toString());

	return (
		<InfoTable
			data={{ ...account.data, ...balance.data }}
			loading={account.loading || balance.loading}
			notFound={account.notFound || balance.notFound}
			notFoundMessage="Account doesn't exist"
			error={account.error || balance.error}
			{...tableProps}
		>
			<AccountInfoTableAttribute
				label='Substrate address'
				render={(data) => encodeAddress(data.address, NETWORK_CONFIG.prefix)}
				copyToClipboard={(data) =>
					encodeAddress(data.address, NETWORK_CONFIG.prefix)
				}
			/>
			<AccountInfoTableAttribute
				label="Public key"
				render={(data) => u8aToHex(decodeAddress(data.address))}
				copyToClipboard={(data) => u8aToHex(decodeAddress(data.address))}
			/>
			<AccountInfoTableAttribute
				label='Total balance'
				render={() => `${total.toFixed(2).toString()} TAO (${formatCurrency(total.mul(price ?? 0), "USD", {decimalPlaces: 2})} USD)`}
				copyToClipboard={() =>total.toFixed(2).toString()}
			/>
		</InfoTable>
	);
};
