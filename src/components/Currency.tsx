/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { css, Theme } from "@emotion/react";
import { Tooltip } from "@mui/material";
import Decimal from "decimal.js";

import { formatCurrency, FormatCurrencyOptions } from "../utils/number";

const wrapperStyle = css`
	display: inline-block;
`;

const zeroAmountStyle = css`
	opacity: .65;
`;

const usdValueStyle = (theme: Theme) => css`
	font-size: 15px;
	opacity: .75;
	color: ${theme.palette.secondary.dark};
`;

export type CurrencyProps = HTMLAttributes<HTMLDivElement> & {
	amount: Decimal;
	currency: string;
	decimalPlaces?: FormatCurrencyOptions["decimalPlaces"];
	minimalUsdValue?: Decimal;
	usdRate?: Decimal;
	showFullInTooltip?: boolean;
	showUsdValue?: boolean;
}

export const Currency = (props: CurrencyProps) => {
	const {amount, currency, decimalPlaces, usdRate, minimalUsdValue, showFullInTooltip, showUsdValue, ...divProps} = props;

	const usdValue = useMemo(() => usdRate && amount.mul(usdRate), [amount, usdRate]);

	let amountContent = (
		<div css={amount.isZero() && zeroAmountStyle}>
			{formatCurrency(amount, currency, {decimalPlaces, minimalUsdValue, usdRate})}
		</div>
	);

	if (showFullInTooltip) {
		amountContent = (
			<Tooltip
				arrow
				placement="top"
				title={formatCurrency(amount, currency)}
			>
				{amountContent}
			</Tooltip>
		);
	}

	return (
		<div css={wrapperStyle} {...divProps}>
			{amountContent}
			{showUsdValue && usdValue && usdValue.greaterThan(0) &&
				<div css={usdValueStyle}>{formatCurrency(usdValue, "USD", {decimalPlaces: "optimal"})}</div>
			}
		</div>
	);
};
