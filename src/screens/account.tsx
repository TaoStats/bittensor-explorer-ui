/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import TransfersTable from "../components/transfers/TransfersTable";

import { useAccount } from "../hooks/useAccount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useTransfers } from "../hooks/useTransfers";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { useTaoPrice } from "../hooks/useTaoPrice";
import { useBalance } from "../hooks/useBalance";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { formatCurrency, rawAmountToDecimal } from "../utils/number";
import { StatItem } from "../components/network/StatItem";

const accountInfoStyle = css`
  display: flex;
  flex-direction: column;
`;

const accountLabelAddress = css`
  opacity: 0.5;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const accountHeader = (theme: Theme) => css`
  display: flex;
  gap: 4px;
  align-items: center;
  word-break: keep-all;
  color: ${theme.palette.text.primary};
`;

const infoSection = css`
  display: flex;
  @media only screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const accountTitle = css`
  display: block;
  opacity: 0.8;
  width: 144px;
  font-size: 12px;
`;

const portfolioStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  width: 400px;

  ${theme.breakpoints.down("lg")} {
    width: auto;
  }
`;

const summary = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export type AccountPageParams = {
	address: string;
};

export const AccountPage = () => {
	const { address } = useParams() as AccountPageParams;
	const balance = useBalance({ address: { equalTo: address } });

	const account = useAccount(address);
	const extrinsics = useExtrinsics(
		{ signer: { equalTo: address } },
		"BLOCK_HEIGHT_DESC"
	);
	const transfers = useTransfers({
		or: [{ from: { equalTo: address } }, { to: { equalTo: address } }],
	});
	const taoPrice = useTaoPrice();

	const staked = `${formatCurrency(
		rawAmountToDecimal((balance?.data?.staked || 0).toString()),
		"USD",
		{ decimalPlaces: 2 }
	)} 𝞃`;
	const free = `${formatCurrency(
		rawAmountToDecimal((balance?.data?.free || 0).toString()),
		"USD",
		{ decimalPlaces: 2 }
	)} 𝞃`;

	useDOMEventTrigger(
		"data-loaded",
		!account.loading &&
		!extrinsics.loading &&
		!transfers.loading &&
		!taoPrice.loading
	);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 60 * 1000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	const { hash: tab } = useLocation();
	const tabRef = useRef(null);
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	return (
		<>
			<CardRow css={infoSection}>
				<Card css={accountInfoStyle} data-test="account-info">
					<CardHeader css={accountHeader}>
						<div css={accountTitle}>Account</div>
						{/* {(account.loading || account.data) && (
							<AccountAvatar address={address} size={32} css={avatarStyle} />
						)} */}
						<div css={accountLabelAddress}>{address}</div>
					</CardHeader>
					<AccountInfoTable
						info={{
							account,
							balance,
							price: taoPrice.data?.toNumber(),
						}}
					/>
				</Card>
				<Card css={portfolioStyle} data-test="account-portfolio">
					<div css={summary}>
						<StatItem title="Staked" value={staked} />
						<StatItem title="Free" value={free} />
					</div>
					<AccountPortfolio balance={balance} taoPrice={taoPrice} />
				</Card>
			</CardRow>
			{account.data && (
				<Card data-test="account-related-items">
					<div ref={tabRef}>
						<TabbedContent>
							<TabPane
								label="Extrinsics"
								count={extrinsics.pagination.totalCount}
								loading={extrinsics.loading}
								error={extrinsics.error}
								value="extrinsics"
							>
								<ExtrinsicsTable extrinsics={extrinsics} showTime />
							</TabPane>

							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable
									transfers={transfers}
									showTime
									direction={{ show: true, source: address }}
									address={address}
									download
								/>
							</TabPane>
						</TabbedContent>
					</div>
				</Card>
			)}
		</>
	);
};
