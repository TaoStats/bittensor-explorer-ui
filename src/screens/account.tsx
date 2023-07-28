/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { AccountAvatar } from "../components/AccountAvatar";
import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import TransfersTable from "../components/transfers/TransfersTable";

import { useAccount } from "../hooks/useAccount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useTransfers } from "../hooks/useTransfers";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { useTaoPrice } from "../hooks/useTaoPrice";
import { useApi } from "../contexts";
import { Balance } from "../model/balance";
import { Resource } from "../model/resource";
import Decimal from "decimal.js";
import { rawAmountToDecimal } from "../utils/number";

const accountInfoStyle = css`
  display: flex;
  flex-direction: column;
`;

const avatarStyle = css`
  vertical-align: text-bottom;
  margin-left: 12px;
`;

const accountLabel = css`
  margin-left: 8px;
  font-weight: 400;
`;

const accountLabelName = css``;

const accountLabelAddress = css`
  opacity: 0.5;
`;

const portfolioStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  width: 400px;

  ${theme.breakpoints.down("lg")} {
    width: auto;
  }
`;

export type AccountPageParams = {
	address: string;
};

export const AccountPage = () => {
	const { address } = useParams() as AccountPageParams;
	const {
		state: { api, apiState },
	} = useApi();

	const fetchBalance = async () => {
		if (!api || apiState !== "READY") {
			setBalance({
				...balance,
				loading: true,
				notFound: false,
				data: undefined,
			});
		} else {
			setBalance({
				...balance,
				loading: true,
			});
			const res = await api.query.system.account(address);
			let free = new Decimal(0);
			let reserved = new Decimal(0);
			if (!res.isEmpty) {
				const accountData = await res.toJSON();
				const {
					data: { free: _free, reserved: _reserved },
				} = accountData;
				free = rawAmountToDecimal(_free);
				reserved = rawAmountToDecimal(_reserved);
			}
			setBalance({
				...balance,
				data: {
					reserved,
					free,
					total: free.add(reserved),
				},
				loading: false,
				notFound: false,
			});
		}
	};
	const [balance, setBalance] = useState<Resource<Balance>>({
		loading: true,
		notFound: false,
		refetch: fetchBalance,
	});

	const account = useAccount(address);
	const extrinsics = useExtrinsics({ signer: { equalTo: address } });
	const transfers = useTransfers({
		or: [{ from: { equalTo: address } }, { to: { equalTo: address } }],
	});

	const taoPrice = useTaoPrice();

	useEffect(() => {
		fetchBalance();
	}, [api, apiState]);

	useDOMEventTrigger(
		"data-loaded",
		!account.loading &&
      !extrinsics.loading &&
      !transfers.loading &&
      !taoPrice.loading
	);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 6 * 1000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<CardRow>
				<Card css={accountInfoStyle} data-test='account-info'>
					<CardHeader>
            Account
						{(account.loading || account.data) && (
							<AccountAvatar address={address} size={32} css={avatarStyle} />
						)}
						<span css={accountLabel}>
							{account.data?.identity?.display ? (
								<span css={accountLabelName}>
									{account.data?.identity?.display}
								</span>
							) : (
								<span css={accountLabelAddress}>{address}</span>
							)}
						</span>
					</CardHeader>
					<AccountInfoTable account={account} />
				</Card>
				<Card css={portfolioStyle} data-test='account-portfolio'>
					<CardHeader>Account Balance</CardHeader>
					<AccountPortfolio balance={balance} taoPrice={taoPrice} />
				</Card>
			</CardRow>
			{account.data && (
				<Card data-test='account-related-items'>
					<TabbedContent>
						<TabPane
							label='Extrinsics'
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value='extrinsics'
						>
							<ExtrinsicsTable extrinsics={extrinsics} showTime />
						</TabPane>

						<TabPane
							label='Transfers'
							count={transfers.pagination.totalCount}
							loading={transfers.loading}
							error={transfers.error}
							value='transfers'
						>
							<TransfersTable transfers={transfers} showTime />
						</TabPane>
					</TabbedContent>
				</Card>
			)}
		</>
	);
};
