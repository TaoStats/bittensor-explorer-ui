/** @jsxImportSource @emotion/react */
import { forwardRef, ReactNode, useRef } from "react";
import { css, Theme } from "@emotion/react";

import { CollapsibleRef, CollapsibleValue } from "./CollapsibleValue";

const wrapperStyle = css`
	font-size: 14px;
`;

const objectContentStyle = css`
	padding-left: 32px;
	border-left: dotted 1px rgba(0, 0, 0, .125);
`;

const objectKeyValue = css`
	min-width: 250px;
`;

const numberKeyStyle = (theme: Theme) => css`
	margin-right: 8px;
	color: ${theme.palette.success.main};

	&::after {
		content: attr(data-content);
	}
`;

const stringKeyStyle = css`
	margin-right: 8px;
	word-break: break-all;

	&::after {
		//content: ' : ';
	}
`;

const literalValueStyle = css`
	word-break: break-all;
`;

const stringValueStyle = (theme: Theme) => css`
	${literalValueStyle}

	color: ${theme.palette.text.primary};
`;

const numberValueStyle = (theme: Theme) => css`
	${literalValueStyle}

	color: ${theme.palette.secondary.dark};
`;

const booleanValueStyle = (theme: Theme) => css`
	${literalValueStyle}

	color: ${theme.palette.secondary.dark};
`;

const otherValueStyle = css`
	${literalValueStyle}

	color: gray;
`;

const hiddenStyle = css`
	display: inline-block;
	overflow: hidden;
	width: 1px;
	height: 1px;
`;

type KeyValueProps = {
	name: ReactNode;
	value: any;
	depth?: number;
	isLast?: boolean;
}

function Indent(props: {depth: number}) {
	return null; // TODO it is slow
	return (
		<pre css={hiddenStyle}>
			{" ".repeat(props.depth * 4)}
			{/*Array(props.depth * 4).fill(null).map((_, index) =>
				<span key={index}>&nbsp;</span>
		)*/}
		</pre>
	);
}

const KeyValue = (props: KeyValueProps) => {
	const {name, value, depth = 0, isLast} = props;

	const collapseRef = useRef<CollapsibleRef>(null);

	return (
		<div css={objectKeyValue}>
			<span onClick={() => collapseRef.current?.toggle()}>
				<Indent depth={depth} />
				{Number.isInteger(name)
					? <span css={numberKeyStyle} data-content={`${name}: `} />
					: <span css={stringKeyStyle}>&quot;{name}&quot;: </span>
				}
			</span>
			<DataViewerValueJsonInner value={value} ref={collapseRef} depth={depth} />
			{!isLast && <span css={hiddenStyle}>,</span>}
		</div>
	);
};

export type DataViewerValueJsonProps = {
	value: any;
	depth?: number;
};

export const DataViewerValueJsonInner = forwardRef<CollapsibleRef, DataViewerValueJsonProps>((props, ref) => {
	const { value, depth = 0 } = props;

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return <span css={otherValueStyle}>[ ]</span>;
		}

		return (
			<CollapsibleValue
				before="["
				after={<span><Indent depth={depth} />{"]"}</span>}
				meta={`${value.length} ${value.length === 1 ? "item" : "items"}`}
				ref={ref}
			>
				{value.length > 0 &&
					<div css={objectContentStyle}>
						{value.map((item, index) =>
							<KeyValue
								key={index}
								name={index}
								value={item}
								depth={depth + 1}
								isLast={index === value.length - 1}
							/>
						)}
					</div>
				}
			</CollapsibleValue>
		);
	} else if (value && typeof value === "object") {
		const keys = Object.keys(value);
		keys.sort();

		return (
			<CollapsibleValue
				before="{"
				after={<span><Indent depth={depth} />{"}"}</span>}
				meta={`${keys.length} ${keys.length === 1 ? "item" : "items"}`}
				ref={ref}
			>
				<div css={objectContentStyle}>
					{keys.map((key, index) =>
						<KeyValue
							key={key}
							name={key}
							value={value[key]}
							depth={depth + 1}
							isLast={index === keys.length - 1}
						/>
					)}
				</div>
			</CollapsibleValue>
		);
	} else if (typeof value === "string") {
		return <span css={stringValueStyle}>&quot;{value}&quot;</span>;
	} else if (typeof value === "boolean") {
		return <span css={booleanValueStyle}>{value ? "true" : "false"}</span>;
	} else if (Number.isFinite(value)) {
		return <span css={numberValueStyle}>{value}</span>;
	}

	return <span css={otherValueStyle}>{`${value}`}</span>;
});

DataViewerValueJsonInner.displayName = "DataViewerValueJsonInner";

export const DataViewerValueJson = (props: DataViewerValueJsonProps) => {
	return (
		<div css={wrapperStyle}>
			<DataViewerValueJsonInner {...props} />
		</div>
	);
};
