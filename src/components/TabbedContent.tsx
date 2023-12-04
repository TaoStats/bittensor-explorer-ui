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

import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const tabsWrapperStyle = css`
  margin-bottom: 32px;
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
      content: "";
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

const tabErrorStyle = css`
  margin-left: 8px;
  position: relative;
  top: 1px;
  color: #ef5350;
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
	defaultTab?: string;
	children: ReactElement<TabPaneProps> | (ReactElement<TabPaneProps> | false)[];
};

export const TabbedContent = (props: TabbedContentProps) => {
	const { defaultTab, children } = props;

	const navigate = useNavigate();

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
				title=""
				key={value}
				id={`#${value}`}
				css={tabStyle}
				label={
					<>
						<span>{label}</span>
						{loading && <Spinner small />}
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

	const [tab, setTab] = useState<string | undefined>(tabPanes.find((it) => it.props.value === defaultTab) ? defaultTab : tabPanes[0]?.props.value);

	return (
		<>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={(_, tab) => {
						setTab(tab);
						navigate(`#${tab}`);
					}}
					value={tab || tabHandles[0]!.props.value}
					variant="scrollable"
					scrollButtons={false}
				>
					{tabHandles}
				</Tabs>
			</div>
			{tab ? tabPanes.find((it) => it.props.value === tab) : tabPanes[0]}
		</>
	);
};
