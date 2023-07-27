/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { encodeAddress, isEthereumAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Resource } from "../../model/resource";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NETWORK_CONFIG } from "../../config";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	account: Resource<Account>;
}

const AccountInfoTableAttribute = InfoTableAttribute<Account>;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const { account, ...tableProps } = props;

	return (
		<InfoTable
			data={account.data}
			loading={account.loading}
			notFound={account.notFound}
			notFoundMessage="Account doesn't exist"
			error={account.error}
			{...tableProps}
		>
			<AccountInfoTableAttribute
				label="Substrate address"
				render={(data) => encodeAddress(data.address, NETWORK_CONFIG.prefix)}
				copyToClipboard={(data) => encodeAddress(data.address, NETWORK_CONFIG.prefix)}
			/>
			<AccountInfoTableAttribute
				label={(data) => isEthereumAddress(data.address) ? "Address" : "Public key"}
				render={(data) => data.address}
				copyToClipboard={(data) => data.address}
			/>
		</InfoTable>
	);
};
