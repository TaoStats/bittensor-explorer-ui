/** @jsxImportSource @emotion/react */
import { css } from "@mui/material";

import { Theme } from "@emotion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const searchStyle = () => css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 0 0 20px;
  font-size: 14px;
`;

const searchLabelStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  margin-right: 5px;
`;

const searchInputStyle = css`
  background-color: rgb(18, 18, 18);
  background-image: url(/search.svg);
  background-position: 18px center;
  background-repeat: no-repeat;
  background-size: 16px;
  border: 0;
  border-radius: 3px;
  color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 5px 0 41px;
  width: 200px;
`;

type TableSearchProps = {
	value?: string;
	onChange?: (newValue?: string) => void;
	placeholder?: string;
};

export function TableSearch(props: TableSearchProps) {
	const { onChange, placeholder } = props;
	const [value, setValue] = useState<string>("");
	const debouncedValue = useDebounce<string>(value, 800);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	useEffect(() => {
		if (onChange) onChange(debouncedValue);
	}, [debouncedValue]);

	return (
		<div css={searchStyle}>
			<label css={searchLabelStyle}>Search:</label>
			<input
				css={searchInputStyle}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
			/>
		</div>
	);
}
