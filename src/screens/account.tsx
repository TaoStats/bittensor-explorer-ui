/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
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
import { useBalance } from "../hooks/useBalance";

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

const accountHeader = css`
  display: flex;
  align-items: center;
`;

const infoSection = css`
  display: flex;
  @media only screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

export type AccountPageParams = {
	address: string;
};

export const AccountPage = () => {
	const { address } = useParams() as AccountPageParams;
	const balance = useBalance({address: {equalTo: address}});

	const account = useAccount(address);
	const extrinsics = useExtrinsics({ signer: { equalTo: address } }, undefined, undefined, false);
	const transfers = useTransfers({
		or: [{ from: { equalTo: address } }, { to: { equalTo: address } }],
	});

	const taoPrice = useTaoPrice();

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
			<CardRow css={ infoSection }>
				<Card css={accountInfoStyle} data-test='account-info'>
					<CardHeader css={accountHeader}>
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
					<AccountInfoTable info={{ account, balance }} />
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
