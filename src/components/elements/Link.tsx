import { AnchorHTMLAttributes, forwardRef } from "react";
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

export interface LinkProps extends Omit<RouterLinkProps, "to"> {
    to?: RouterLinkProps["to"];
    href?: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
    underline?: "none" | "always" | "hover";
}

export const Link = forwardRef<any, LinkProps>((props, ref) => {
    const { href, to, underline = "hover", ...restProps } = props;

    if (to) {
        return (
            <MuiLink
                ref={ref}
                component={RouterLink}
                to={to}
                underline={underline}
                {...restProps}
            />
        );
    }

    return <MuiLink href={href} underline={underline} {...restProps} />;
});

Link.displayName = "Link";
