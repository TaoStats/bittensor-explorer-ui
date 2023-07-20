import { alpha, createTheme, darken, lighten } from "@mui/material";
import { grey } from "@mui/material/colors";
import { css } from "@emotion/react";

const customColors = {
	neutral: "#606060"
};

export const theme = createTheme({
	palette: {
		primary: {
			main: "#ff646d",
			contrastText: "#ffffff",
			light: "#a8a8a8",
			dark: "#181818",
		},
		secondary: {
			main: "#14a1c0",
			contrastText: "#ffffff"
		},
		neutral: {
			main: customColors.neutral,
			dark: darken(customColors.neutral, 0.1),
			light: lighten(customColors.neutral, 0.95),
			contrastText: "rgba(0, 0, 0, 0.7)"
		}
	},
	typography: {
		fontFamily: "\"Open Sans\", sans-serif",
		button: {
			fontSize: 18,
			fontWeight: 700,
			textTransform: "none"
		},
	},
	components: {
		MuiLink: {
			styleOverrides: {
				root: ({theme}) => css`
					font-weight: 700;
					font-family: "Google Sans", sans-serif;
					color: ${theme.palette.secondary.main};
				`
			}
		},
		MuiButton: {
			defaultProps: {
				color: "neutral",
				disableElevation: true,
			},
			styleOverrides: {
				root: ({theme}) => css`
					padding: 6px 32px;
					&:hover {
						background-color: ${theme.palette.secondary.main};
					}
				`,
				sizeSmall: css`
					padding: 2px 10px;
					font-size: 16px;
					font-weight: 400;
				`,
				text: ({theme, ownerState}) => css`
					${ownerState.color && ownerState.color !== "inherit" && css`
						${ownerState.size === "small" && css`
							color: ${theme.palette[ownerState.color].dark};
						`}

						background-color: ${alpha(theme.palette[ownerState.color].main, .075)};

						&:hover {
							background-color: ${alpha(theme.palette[ownerState.color].main, .15)};
						}
					`}
				`
			}
		},
		MuiToggleButton: {
			styleOverrides: {
				root: ({ownerState}) => {
					const color = (!ownerState.color || ownerState.color === "standard") ? "neutral" : ownerState.color;
					return css`
						padding: 6px 16px;
						color: ${theme.palette.neutral.dark};
						background-color: ${alpha(theme.palette.neutral.main, .075)};
						border: none;

						&:hover {
							background-color: ${alpha(theme.palette.neutral.main, .15)};
						}

						&.Mui-selected {
							${ownerState.size === "small" && css`
								color: ${darken(theme.palette[color].dark, 0.25)};
							`}

							background-color: ${alpha(theme.palette[color].main, .25)};

							&:hover {
								background-color: ${alpha(theme.palette[color].main, .3)};
							}
						}
					`;
				},
				sizeSmall: css`
					padding: 2px 10px;
					font-size: 16px;
					font-weight: 400;
				`,
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: css`
					padding: 4px;
					border-radius: 4px;

					> svg {
						display: block;
					}
				`
			}
		},
		MuiButtonGroup: {
			defaultProps: {
				disableElevation: true,
			}
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				grouped: css`
					&:not(:first-of-type) {
						border-left: none;
						margin-left: 0;
					}
				`
			}
		},
		MuiInputBase: {
			styleOverrides: {
				root: css`
					font-size: 18px;
				`,
				input: css`
					height: 24px;
					padding: 12px 16px;

					color: black;

					&::placeholder {
						color: #999999;
						opacity: 1;
					}
				`
			}
		},
		MuiSelect: {
			styleOverrides: {
				select: css`
					height: 24px;
					min-height: 24px;

					padding: 12px 24px;

					&& {
						padding-right: 40px;
					}
				`
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: css`
					border-radius: 8px;

					&:hover {
						.MuiOutlinedInput-notchedOutline {
							border-color: ${grey[400]};
						}
					}

					&.Mui-focused {
						.MuiOutlinedInput-notchedOutline {
							border-width: 1px;
							border-color: ${grey[600]};
						}
					}
				`,
				input: css`
					border-radius: inherit;
					background-color: ${grey[100]};
					height: 24px;
					padding: 12px 16px;

					&:focus {
						border-radius: inherit;
					}
				`,
				notchedOutline: css`
					border-color: ${grey[300]};
				`,
			}
		},
		MuiTableRow: {
			styleOverrides: {
				root: css`
					&:last-child {
						> .MuiTableCell-body {
							border-bottom: none;
						}
					}
				`
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: css`
					font-size: 16px;
					line-height: 22px;
				`,
				head: css`
					font-weight: 700;
				`
			}
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: css`
					line-height: 20px;
					padding: 8px 12px;

					font-size: 14px;
					color: white;
					background-color: black;
				`,
				arrow: css`
					color: black!important;
				`
			}
		},
		MuiChip: {
			styleOverrides: {
				root: css`
					border: none;
					height: auto;
					font-size: 16px;
					justify-content: flex-start;
				`,
				icon: css`
					margin-left: 0;
					margin-right: -4px;
				`,
				label: css`
					padding-left: 0;
					padding-right: 0;
					white-space: normal;

					.MuiChip-icon + & {
						padding-left: 12px;
					}
				`
			}
		}
	}
});
