/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

const textFieldStyle = css`
	.MuiInputBase-root {
		border-radius: 0;
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;

		&, &:hover, &.Mui-focused {
			.MuiOutlinedInput-notchedOutline {
				border: none;
			}
		}
	}
`;

const buttonStyle = (theme: Theme) => css`
	border-radius: 8px;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
	font-size: 13px;
	font-weight: 500;
	letter-spacing: .1em;

	.MuiButton-startIcon {
		display: none;
		margin: 0;

		svg {
			font-size: 28px;
		}
	}

	${theme.breakpoints.down("md")} {
		padding-left: 16px;
		padding-right: 16px;

		.text {
			display: none;
		}

		.MuiButton-startIcon {
			display: flex;
		}
	}
`;

export type SearchInputProps = FormHTMLAttributes<HTMLFormElement> & {
	persistNetwork?: boolean;
	onNetworkChange?: (network?: string) => void;
};

function SearchInput(props: SearchInputProps) {
	const { persistNetwork, onNetworkChange, ...restProps } = props;

	const [qs] = useSearchParams();
	const query = qs.get("query");

	const [search, setSearch] = useState<string>(query || "");

	const navigate = useNavigate();

	const handleSubmit = useCallback(
		(e: any) => {
			e.preventDefault();
			navigate(`/search?query=${search}`);
		},
		[navigate, search]
	);

	useEffect(() => {
		setSearch(query || "");
	}, [query]);

	return (
		<form {...restProps} onSubmit={handleSubmit}>
			<FormGroup row css={formGroupStyle}>
				<TextField
					css={textFieldStyle}
					fullWidth
					id="search"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Account / Block / Extrinsic / Hash"
					value={search}
				/>
				<Button
					css={buttonStyle}
					onClick={handleSubmit}
					startIcon={<SearchIcon />}
					type="submit"
					variant="contained"
					color="primary"
				>
					<span className="text">Search</span>
				</Button>
			</FormGroup>
		</form>
	);
}

export default SearchInput;
