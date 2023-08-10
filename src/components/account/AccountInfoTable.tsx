/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { encodeAddress, isEthereumAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Resource } from "../../model/resource";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NETWORK_CONFIG } from "../../config";
import { AccountBalance } from "../../model/balance";
import { rawAmountToDecimal } from "../../utils/number";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	info: {
		account: Resource<Account>;
		balance: Resource<AccountBalance>;
	};
}

const AccountInfoTableAttribute = InfoTableAttribute<Account & AccountBalance>;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const { info: { account, balance }, ...tableProps } = props;

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
				label={(data) =>
					isEthereumAddress(data.address) ? "Address" : "Public key"
				}
				render={(data) => data.address}
				copyToClipboard={(data) => data.address}
			/>
			<AccountInfoTableAttribute
				label='Total balance'
				render={(data) => `${rawAmountToDecimal(data.total.toString()).toFixed(2).toString()} TAO`}
				copyToClipboard={(data) =>
					rawAmountToDecimal(data.total.toString()).toString()
				}
			/>
		</InfoTable>
	);
};
