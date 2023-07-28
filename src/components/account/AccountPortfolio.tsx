/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { Theme, css } from "@emotion/react";

import { Resource } from "../../model/resource";
import { formatCurrency } from "../../utils/number";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";

import { AccountPortfolioChart } from "./AccountPortfolioChart";
import Decimal from "decimal.js";
import { Balance } from "../../model/balance";

const chartStyle = css`
  margin: 0 auto;
  margin-top: 32px;
`;

const valuesStyle = (theme: Theme) => css`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;

  ${theme.breakpoints.down("sm")} {
    display: block;
  }
`;

const valueStyle = (theme: Theme) => css`
  min-width: 70px;

  ${theme.breakpoints.down("sm")} {
    display: flex;
    max-width: 230px;
    margin: 0 auto;
  }
`;

const valueTypeStyle = (theme: Theme) => css`
  margin-bottom: 8px;
  font-weight: 500;

  ${theme.breakpoints.down("sm")} {
    flex: 1 1 auto;
  }
`;

const separatorStyle = css`
  display: block;
  width: 1px;
  flex: 0 0 auto;
  background-color: rgba(0, 0, 0, 0.125);
`;

const notFoundStyle = css`
  margin: 0 auto;
  max-width: 300px;
`;

export type AccountPortfolioProps = HTMLAttributes<HTMLDivElement> & {
	balance: Resource<Balance>;
	taoPrice: Resource<Decimal>;
};

export const AccountPortfolio = (props: AccountPortfolioProps) => {
	const { balance, taoPrice } = props;
	
	if (balance.loading || taoPrice.loading) {
		return <Loading />;
	}

	if (balance.notFound || balance.data?.total.eq(0)) {
		return (
			<NotFound css={notFoundStyle}>
				No balance
			</NotFound>
		);
	}

	if (balance.error) {
		return (
			<ErrorMessage
				message='Unexpected error occured while fetching data'
				details={balance.error.message}
				showReported
			/>
		);
	}

	if (!balance.data || !taoPrice.data) {
		return null;
	}

	return (
		<div>
			<div css={valuesStyle}>
				<div css={valueStyle} data-test='porfolio-total'>
					<div css={valueTypeStyle}>Total</div>
					<div>
						{formatCurrency(balance.data.total, "USD", {
							decimalPlaces: "optimal",
						})}
					</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test='porfolio-free'>
					<div css={valueTypeStyle}>Free</div>
					<div>
						{formatCurrency(balance.data.free, "USD", { decimalPlaces: "optimal" })}
					</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test='porfolio-reserved'>
					<div css={valueTypeStyle}>Reserved</div>
					<div>
						{formatCurrency(balance.data.reserved, "USD", {
							decimalPlaces: "optimal",
						})}
					</div>
				</div>
			</div>
			<AccountPortfolioChart
				css={chartStyle}
				balance={balance.data}
				taoPrice={taoPrice.data}
			/>
		</div>
	);
};
