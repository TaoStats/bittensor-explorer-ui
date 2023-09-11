/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useEffect, useState } from "react";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Resource } from "../../model/resource";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NETWORK_CONFIG } from "../../config";
import { Balance } from "../../model/balance";
import {
	formatCurrency,
	formatNumber,
	rawAmountToDecimal,
} from "../../utils/number";
import { u8aToHex } from "@polkadot/util";
import { css } from "@emotion/react";
import Decimal from "decimal.js";
import { countBalanceItems } from "../../services/balancesService";
import { BlockTimestamp } from "../BlockTimestamp";
import { Link } from "../Link";
import { DelegateBalance } from "../../model/delegate";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	info: {
		account: Resource<Account>;
		balance: Resource<Balance>;
		delegates: Resource<DelegateBalance[]>;
		price: number | undefined;
	};
};

const AccountInfoTableAttribute = InfoTableAttribute<Account & Balance>;

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

const createdAt = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const blockLink = css`
  ::before {
    content: '(';
  }
  ::after {
    content: ')';
  }
`;

const delegateContainer = css`
  display: flex;
  flex-direction: column;
`;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const {
		info: { account, balance, price, delegates },
		...tableProps
	} = props;

	const total = rawAmountToDecimal(balance.data?.total.toString());
	const [rank, setRank] = useState<number>();

	useEffect(() => {
		const fetchRank = async () => {
			if (balance.data?.total === undefined) return;
			const total = balance.data.total;
			if (total === BigInt(0)) return;
			const _rank = await countBalanceItems({
				balanceTotal: { greaterThan: total },
			});
			setRank(_rank + 1);
		};
		fetchRank();
	}, [balance.data?.total]);

	return (
		<InfoTable
			data={{ ...account.data, ...balance.data }}
			loading={account.loading || balance.loading || delegates.loading}
			notFound={account.notFound}
			notFoundMessage="Account doesn't exist"
			error={account.error || balance.error || delegates.error}
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
			{balance.data?.createdAt ? (
				<AccountInfoTableAttribute
					label='Created at'
					render={(data) =>
						data.createdAt > BigInt(0) ? (
							<div css={createdAt}>
								<BlockTimestamp blockHeight={data.createdAt} />
								<Link href={`/block/${data.createdAt}`} css={blockLink}>
									{`Block ${data.createdAt}`}
								</Link>
							</div>
						) : (
							<div>Pre dates Finney chain. Nakamoto data coming soon.</div>
						)
					}
				/>
			) : (
				<></>
			)}
			<AccountInfoTableAttribute
				label='Total balance'
				render={() => (
					<div css={balanceContainer}>
						<span css={taoBalance}>
							{`${formatCurrency(
								new Decimal(total.toFixed(2).toString()),
								"USD",
								{ decimalPlaces: 2 }
							)} 𝞃`}
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
			{balance.data !== undefined && balance.data.staked > 0 && delegates.data !== undefined && delegates.data.length ? (
				<AccountInfoTableAttribute
					label='Delegated balance'
					render={() => (
						<div>
							{delegates.data?.map(({ delegate, amount, delegateName }, index) => (
								<div css={delegateContainer} key={index}>
									<Link to={`/validators/${delegate}`}>{`${delegateName ?? delegate}`}</Link>
									<span>
										{`${formatCurrency(
											rawAmountToDecimal(amount.toString()),
											"𝞃",
											{ decimalPlaces: 2 }
										)}`}
									</span>
								</div>
							))}
						</div>
					)}
				/>
			) : (
				<></>
			)}
		</InfoTable>
	);
};
