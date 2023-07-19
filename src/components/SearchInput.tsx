/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

// import NetworkSelect from "./NetworkSelect";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

// const networkSelectStyle = (theme: Theme) => css`
// 	border-top-right-radius: 0;
// 	border-bottom-right-radius: 0;

// 	&, &:hover, &.Mui-focused {
// 		.MuiOutlinedInput-notchedOutline {
// 			border-color: #c4cdd5;
// 			border-right: none;
// 		}
// 	}

// 	&::after {
// 		position: absolute;
// 		right: 0;
// 		content: '';
// 		display: block;
// 		width: 1px;
// 		height: 24px;
// 		background-color: #c4cdd5;
// 		z-index: 10;
// 	}

// 	${theme.breakpoints.down("sm")} {
// 		.MuiListItemIcon-root {
// 			min-width: 0;
// 		}

// 		.MuiListItemText-root {
// 			display: none;
// 		}
// 	}
// `;

const textFieldStyle = css`
	.MuiInputBase-root {
		border-radius: 0;
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;

		.MuiOutlinedInput-notchedOutline {
			// border-left: none;
		}

		&, &:hover, &.Mui-focused {
			.MuiOutlinedInput-notchedOutline {
				border-color: #c4cdd5;
				border-right: none;
			}
		}
	}
`;

const buttonStyle = (theme: Theme) => css`
	border-radius: 8px;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;

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
	defaultNetwork?: string;
	persistNetwork?: boolean;
	onNetworkChange?: (network?: string) => void;
};

function SearchInput(props: SearchInputProps) {
	const { defaultNetwork, persistNetwork, onNetworkChange, ...restProps } = props;

	// console.log("default network", defaultNetwork);

	const [qs] = useSearchParams();
	const query = qs.get("query");
	// console.log(qs, query);

	const [network, setNetwork] = useState<string | undefined>(defaultNetwork);
	const [search, setSearch] = useState<string>(query || "");

	const navigate = useNavigate();

	// const handleNetworkSelect = useCallback((network: string, isUserAction: boolean) => {
	// 	if (isUserAction && persistNetwork) {
	// 		console.log("store", network);
	// 		localStorage.setItem("network", network);
	// 	}

	// 	setNetwork(network);
	// }, [persistNetwork]);

	const handleSubmit = useCallback(
		(e: any) => {
			if (!network) {
				return;
			}

			e.preventDefault();
			navigate(`/search?query=${search}`);
		},
		[navigate, network, search]
	);

	useEffect(() => {
		setSearch(query || "");
	}, [query]);

	useEffect(() => {
		if (persistNetwork) {
			const network = localStorage.getItem("network");
			network && setNetwork(network);
		}
	}, [persistNetwork]);

	useEffect(() => {
		onNetworkChange?.(network);
	}, [onNetworkChange, network]);

	return (
		<form {...restProps} onSubmit={handleSubmit}>
			<FormGroup row css={formGroupStyle}>
				{/* <NetworkSelect
					css={networkSelectStyle}
					onChange={handleNetworkSelect}
					value={network}
				/> */}
				<TextField
					css={textFieldStyle}
					fullWidth
					id="search"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
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
