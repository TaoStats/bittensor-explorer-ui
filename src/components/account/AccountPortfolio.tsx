/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

import { Resource } from "../../model/resource";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";

import { AccountPortfolioChart } from "./AccountPortfolioChart";
import Decimal from "decimal.js";
import { AccountBalance } from "../../model/balance";

const chartStyle = css`
  margin: 0 auto;
  margin-top: 32px;
`;

const notFoundStyle = css`
  margin: 0 auto;
  max-width: 300px;
`;

export type AccountPortfolioProps = HTMLAttributes<HTMLDivElement> & {
	balance: Resource<AccountBalance>;
	taoPrice: Resource<Decimal>;
};

export const AccountPortfolio = (props: AccountPortfolioProps) => {
	const { balance, taoPrice } = props;
	
	if (balance.loading || taoPrice.loading) {
		return <Loading />;
	}

	if (balance.notFound || balance.data?.total === BigInt(0)) {
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
			<AccountPortfolioChart
				css={chartStyle}
				balance={balance.data}
				taoPrice={taoPrice.data}
			/>
		</div>
	);
};
