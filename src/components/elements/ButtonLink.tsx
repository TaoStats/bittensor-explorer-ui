import { Button, ButtonProps } from "@mui/material";

import { Link, LinkProps } from "./Link";

export type ButtonLinkProps = ButtonProps & LinkProps;

export const ButtonLink = (props: ButtonLinkProps) => {
	return (
		<Button component={Link} {...props} />
	);
};
