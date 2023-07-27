/** @jsxImportSource @emotion/react */
import {
	Children,
	cloneElement,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	useState,
} from "react";
import { Theme, css } from "@emotion/react";
import { Tab, TabProps, Tabs } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Warning";

import LoadingSpinner from "../assets/loading.gif";

const tabsWrapperStyle = css`
  margin-bottom: 16px;
`;

const tabsStyle = (theme: Theme) => css`
  margin-bottom: -1px;
  min-height: 32px;
  padding: 0px 20px;

  .MuiTab-root {
    text-transform: uppercase;

    & > span {
      padding-bottom: 4px;
    }

    & > span:first-of-type::after {
      position: absolute;
      content: '';
      width: 0px;
      height: 4px;
      background-color: ${theme.palette.success.main};
      transition: all 0.5s;
      -webkit-transition: all 0.5s;
      display: inline-block;
      bottom: 0;
      left: 0;
    }
  }

  .MuiTab-root:hover,
  .MuiTab-root.Mui-selected {
    & > span:first-of-type::after {
      width: 9px;
    }
  }

  .MuiTabs-indicator {
    display: none;
  }
`;

const tabStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  margin-right: 32px;
  color: ${theme.palette.secondary.main};
  justify-content: flex-start;
  min-width: inherit;
  min-height: inherit;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.1em;

  &.Mui-selected {
    color: ${theme.palette.secondary.light};
  }
`;

const tabCountStyle = css`
  margin-left: 4px;
`;

const tabErrorStyle = css`
  margin-left: 8px;
  position: relative;
  top: 1px;
  color: #ef5350;
`;

const tabLoadingStyle = css`
  margin-left: 8px;
  width: 22px;
`;

export type TabPaneProps = Omit<TabProps, "children"> &
PropsWithChildren<{
	label: ReactNode;
	count?: number;
	loading?: boolean;
	error?: boolean;
	value: string;
}>;

export const TabPane = (props: TabPaneProps) => {
	return <>{props.children}</>;
};

export type TabbedContentProps = {
	children: ReactElement<TabPaneProps> | (ReactElement<TabPaneProps> | false)[];
};

export const TabbedContent = (props: TabbedContentProps) => {
	const { children } = props;

	const [tab, setTab] = useState<string | undefined>(undefined);

	const tabHandles = Children.map(children, (child) => {
		if (!child) {
			return null;
		}

		const {
			value,
			label,
			count,
			loading,
			error,
			children, // ignore
			...restProps
		} = child.props;

		return (
			<Tab
				title=''
				key={value}
				css={tabStyle}
				label={
					<>
						<span>{label}</span>
						{Number.isInteger(count) && (
							<span data-test='count' css={tabCountStyle}>
                ({count})
							</span>
						)}
						{loading && <img src={LoadingSpinner} css={tabLoadingStyle} />}
						{!!error && <ErrorIcon css={tabErrorStyle} />}
					</>
				}
				value={value}
				data-test={`${value}-tab`}
				{...restProps}
			/>
		);
	});

	const tabPanes = Children.map(
		children,
		(child) => child && cloneElement(child, { key: child.props.value })
	);

	return (
		<>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={(_, tab) => setTab(tab)}
					value={tab || tabHandles[0]!.props.value}
					variant='scrollable'
					scrollButtons={false}
				>
					{tabHandles}
				</Tabs>
			</div>
			{tab ? tabPanes.find((it) => it.props.value === tab) : tabPanes[0]}
		</>
	);
};
