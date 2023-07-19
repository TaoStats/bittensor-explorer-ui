/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { Theme, css } from "@emotion/react";

import { AccountBalance } from "../../model/accountBalance";
import { Resource } from "../../model/resource";
import { UsdRates } from "../../model/usdRates";
import { usdBalanceSum } from "../../utils/balance";
import { formatCurrency } from "../../utils/number";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";

import { AccountPortfolioChart } from "./AccountPortfolioChart";

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
	font-weight: 700;

	${theme.breakpoints.down("sm")} {
		flex: 1 1 auto;
	}
`;

const separatorStyle = css`
	display: block;
	width: 1px;
	flex: 0 0 auto;
	background-color: rgba(0, 0, 0, .125);
`;


const notFoundStyle = css`
	margin: 0 auto;
	max-width: 300px;
`;

export type AccountPortfolioProps = HTMLAttributes<HTMLDivElement> & {
	balances: Resource<AccountBalance[]>;
	usdRates: Resource<UsdRates>;
};

export const AccountPortfolio = (props: AccountPortfolioProps) => {
	const {balances, usdRates} = props;

	const stats = useMemo(() => {
		return {
			total: usdBalanceSum(balances.data, "total", usdRates.data),
			free: usdBalanceSum(balances.data, "free", usdRates.data),
			reserved: usdBalanceSum(balances.data, "reserved", usdRates.data),
		};
	}, [balances, usdRates]);

	if (balances.loading || usdRates.loading) {
		return <Loading />;
	}

	if (balances.notFound || stats.total.eq(0)) {
		return <NotFound css={notFoundStyle}>No positive balances with conversion rate to USD found</NotFound>;
	}

	if (balances.error) {
		return (
			<ErrorMessage
				message="Unexpected error occured while fetching data"
				details={balances.error.message}
				showReported
			/>
		);
	}

	if (!balances.data || !usdRates.data) {
		return null;
	}

	return (
		<div>
			<div css={valuesStyle}>
				<div css={valueStyle} data-test="porfolio-total">
					<div css={valueTypeStyle}>Total</div>
					<div>{formatCurrency(stats.total, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test="porfolio-free">
					<div css={valueTypeStyle}>Free</div>
					<div>{formatCurrency(stats.free, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test="porfolio-reserved">
					<div css={valueTypeStyle}>Reserved</div>
					<div>{formatCurrency(stats.reserved, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
			</div>
			<AccountPortfolioChart
				css={chartStyle}
				balances={balances.data}
				usdRates={usdRates.data}
			/>
		</div>
	);
};
