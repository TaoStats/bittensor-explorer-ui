/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useEffect, useState } from "react";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Resource } from "../../model/resource";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NETWORK_CONFIG } from "../../config";
import { AccountBalance } from "../../model/balance";
import { formatCurrency, formatNumber, rawAmountToDecimal } from "../../utils/number";
import { u8aToHex } from "@polkadot/util";
import { css } from "@emotion/react";
import Decimal from "decimal.js";
import { countBalanceItems } from "../../services/balancesService";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	info: {
		account: Resource<Account>;
		balance: Resource<AccountBalance>;
		price: number | undefined;
	};
};

const AccountInfoTableAttribute = InfoTableAttribute<Account & AccountBalance>;

const balanceContainer = css`
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
`;

const taoBalance = css`
  font-weight: bold;
`;

const addressItem = css`
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: keep-all;
`;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const {
		info: { account, balance, price },
		...tableProps
	} = props;

	const total = rawAmountToDecimal(balance.data?.total.toString());
	const [rank, setRank] = useState<number>();

	useEffect(() => {
		const fetchRank = async () => {
			if (balance.data?.total === undefined) return;
			const _rank = await countBalanceItems({
				balanceTotal: { greaterThan: balance.data?.total },
			});
			setRank(_rank + 1);
		};
		fetchRank();
	}, [balance.data?.total]);

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
				render={(data) => (
					<div css={addressItem}>
						{encodeAddress(data.address, NETWORK_CONFIG.prefix)}
					</div>
				)}
				copyToClipboard={(data) =>
					encodeAddress(data.address, NETWORK_CONFIG.prefix)
				}
			/>
			<AccountInfoTableAttribute
				label='Public key'
				render={(data) => (
					<div css={addressItem}>{u8aToHex(decodeAddress(data.address))}</div>
				)}
				copyToClipboard={(data) => u8aToHex(decodeAddress(data.address))}
			/>
			<AccountInfoTableAttribute
				label='Total balance'
				render={() => (
					<div css={balanceContainer}>
						<span css={taoBalance}>
							{`${formatCurrency(
								new Decimal(total.toFixed(2).toString()),
								"USD",
								{ decimalPlaces: 2 }
							)} TAO`}
						</span>
						<span>
							{`(${formatCurrency(total.mul(price ?? 0), "USD", {
								decimalPlaces: 2,
							})} USD)`}
						</span>
					</div>
				)}
				copyToClipboard={() => total.toFixed(2).toString()}
			/>
			{rank !== undefined && (
				<AccountInfoTableAttribute
					label='Rank'
					render={() => formatNumber(rank)}
				/>
			)}
		</InfoTable>
	);
};
