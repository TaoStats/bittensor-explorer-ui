/** @jsxImportSource @emotion/react */
import { Interpolation } from "@emotion/react";
import { Theme } from "@mui/material";
import { formatNumber } from "../utils/number";
import { useState, useEffect } from "react";

type AnimatingNumberProps = {
	css: Interpolation<Theme>;
	value: number;
	suffix?: string;
};

export const AnimatingNumber = (props: AnimatingNumberProps) => {
	const { css, value, suffix } = props;
	const [currentNumber, setCurrentNumber] = useState(1);

	useEffect(() => {
		let counter = currentNumber;
		const incrementAmount = (value - currentNumber) / 60; // Transition over 60 frames

		const interval = setInterval(() => {
			counter += incrementAmount;

			if (
				incrementAmount === 0 ||
				(incrementAmount > 0 && counter >= value) ||
				(incrementAmount < 0 && counter <= value)
			) {
				clearInterval(interval);
				counter = value; // Ensure the final value is accurate
			}

			setCurrentNumber(Math.floor(counter));
		}, 16); // 16ms interval for smooth animation (60fps)

		return () => {
			clearInterval(interval); // Clean up interval on unmount
		};
	}, [value]);

	return (
		<div css={css}>
			{formatNumber(currentNumber)} {suffix ?? ""}
		</div>
	);
};
