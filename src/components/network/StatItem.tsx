/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { AnimatingNumber } from "../AnimatingNumber";

const stakingDataBox = css`
  display: flex;
  flex-direction: column;
  padding: 0;
  @media only screen and (max-width: 767px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const statItemLabel = (theme: Theme) => css`
  display: flex;
  font-size: 13px;
  color: ${theme.palette.secondary.dark};
  letter-spacing: 0.01em;
  @media only screen and (max-width: 479px) {
    font-size: 11px;
  }
`;

const statItemValue = (theme: Theme) => css`
  font-weight: 300;
  color: ${theme.palette.secondary.light};
  margin: 0;
  line-height: 1.3em;

  @media only screen and (max-width: 1279px) {
    font-size: 15px;
  }
  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 639px) {
    font-size: 13px;
    letter-spacing: 0.02em;
  }
`;

type StatItemProps = {
	title: string;
	value: string | number;
	animating?: string;
	suffix?: string;
};

export const StatItem = (props: StatItemProps) => {
	const { title, value, animating, suffix } = props;

	return (
		<div css={stakingDataBox}>
			<label css={statItemLabel}>{title}</label>
			{animating ? (
				<AnimatingNumber
					css={statItemValue}
					value={parseInt(animating)}
					suffix={suffix}
				/>
			) : (
				<div css={statItemValue} className="number-transition">
					{value}
				</div>
			)}
		</div>
	);
};
