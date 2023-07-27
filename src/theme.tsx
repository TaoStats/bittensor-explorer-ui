import { alpha, createTheme, darken, lighten } from "@mui/material";
import { grey } from "@mui/material/colors";
import { css } from "@emotion/react";

const customColors = {
	neutral: "#ff9900"
};

export const theme = createTheme({
	palette: {
		primary: {
			main: "#121212",
			light: "#1c1c1c",
			dark: "#1a1a1a"
		},
		text: {
			primary: "#d9d9d9",
			secondary: "#444"
		},
		secondary: {
			main: "#9c9c9c",
			light: "#fff",
			dark: "#a8a8a8"
		},
		success: {
			main: "#14dec2",
			dark: "#7f7f7f"
		},
		error: {
			main: "#ff7a7a"
		},
		neutral: {
			main: customColors.neutral,
			dark: darken(customColors.neutral, 0.1),
			light: lighten(customColors.neutral, 0.95),
			contrastText: "rgba(0, 0, 0, 0.7)"
		}
	},
	typography: {
		fontFamily: "inter,sans-serif",
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
					font-weight: 500;
					color: ${theme.palette.success.main};
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
					color: ${theme.palette.text.secondary};
					background-color: ${theme.palette.text.primary};
					&:hover {
						background-color: ${theme.palette.secondary.light};
					}
				`,
				sizeSmall: css`
					padding: 2px 10px;
					font-size: 14px;
					font-weight: 300;
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

					color: black;

					&::placeholder {
						color: #999999;
						opacity: 1;
						font-size: 13px;
						letter-spacing: 0;
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
					border: none;

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
				input: ({theme}) => css`
					border-radius: inherit;
					background-color: ${theme.palette.primary.dark};
					color: ${theme.palette.secondary.light};
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
		MuiTable: {
			styleOverrides: {
				root: css`
				`
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
				root: ({theme}) => css`
					font-size: 14px;
					font-weight: 300;
					letter-spacing: .05em;
					line-height: 1.3em;
					padding: 9px 10px;
					border-bottom: 1px solid ${theme.palette.text.secondary};
				`,
				head: ({theme}) => css`
					font-size: 12px;
					font-weight: 500;
					text-transform: uppercase;
					color: ${theme.palette.success.dark} !important;
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
					font-size: 14px;
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
