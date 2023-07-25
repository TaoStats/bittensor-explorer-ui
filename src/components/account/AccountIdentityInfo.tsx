/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { Tooltip } from "@mui/material";
import { css } from "@emotion/react";
import { Email, Language, Person, Twitter } from "@mui/icons-material";

import { ReactComponent as ElementIcon } from "../../assets/element.svg";

import { Resource } from "../../model/resource";
import { Account } from "../../model/account";

import { Link } from "../Link";

const identityItemsStyle = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px 40px;
`;

const identityItemStyle = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;

	svg {
		width: 32px;
		height: 32px;
		opacity: .65;
	}

	.MuiLink-root {
		color: inherit;
	}
`;

export type AccountIdentityInfoProps = HTMLAttributes<HTMLDivElement> & {
	account: Resource<Account>;
}

export const AccountIdentityInfo = (props: AccountIdentityInfoProps) => {
	const {account, ...divProps} = props;

	const identity = account.data?.identity;

	if (!identity) {
		return null;
	}

	return (
		<div css={identityItemsStyle} {...divProps}>
			{identity.web &&
				<Tooltip
					arrow
					placement="top"
					title="Legal name"
				>
					<div css={identityItemStyle}>
						<Person />
						<div>{identity.legal}</div>
					</div>
				</Tooltip>
			}
			{identity.web &&
				<Tooltip
					arrow
					placement="top"
					title="Web"
				>
					<div css={identityItemStyle}>
						<Language />
						<Link href={identity.web}>
							{identity.web}
						</Link>
					</div>
				</Tooltip>
			}
			{identity.email &&
				<Tooltip
					arrow
					placement="top"
					title="E-mail"
				>
					<div css={identityItemStyle}>
						<Email />
						<Link href={`mailto:${identity.email}`}>
							{identity.email}
						</Link>
					</div>
				</Tooltip>
			}
			{identity.twitter &&
				<Tooltip
					arrow
					placement="top"
					title="Twitter"
				>
					<div css={identityItemStyle}>
						<Twitter />
						<Link href={`https://twitter.com/${identity.twitter.replace("@", "")}`}>
							{identity.twitter}
						</Link>
					</div>
				</Tooltip>
			}
			{identity.riot &&
				<Tooltip
					arrow
					placement="top"
					title="Element (Riot)"
				>
					<div css={identityItemStyle}>
						<ElementIcon />
						{identity.riot}
					</div>
				</Tooltip>
			}
		</div>
	);
};
