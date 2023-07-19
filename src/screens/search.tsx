/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { css } from "@emotion/react";
import { isHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";

import { Card, CardHeader } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import EventsTable from "../components/events/EventsTable";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useAccount } from "../hooks/useAccount";
import { useBlock } from "../hooks/useBlock";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useExtrinsicsByName } from "../hooks/useExtrinsicsByName";
import { useEventsByName } from "../hooks/useEventsByName";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

const queryStyle = css`
	font-weight: normal;
	word-break: break-all;

	&::before {
		content: open-quote;
	}

	&::after {
		content: close-quote;
	}
`;

const loadingStyle = css`
	text-align: center;
	word-break: break-all;
`;

export const SearchPage = () => {
	const { network } = useRootLoaderData();

	const [qs] = useSearchParams();
	const query = qs.get("query") || "";

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const maybeHash = isHex(query);
	const maybeHeight = query?.match(/^\d+$/);
	const maybeAddress = isAddress(query);
	const maybeName = query && !maybeHash && !maybeHeight;

	const extrinsicByHash = useExtrinsic(network.name, { hash_eq: query }, { skip: !maybeHash });
	const blockByHash = useBlock(network.name, { hash_eq: query }, { skip: !maybeHash });

	const account = useAccount(network.name, query, {
		// extrinsic and block has precedence before account because the hashes may collide
		// so wait until they are resolved and we know it is not extrinsic or block
		skip: !maybeAddress || extrinsicByHash.error || blockByHash.error,
		waitUntil: extrinsicByHash.loading || blockByHash.loading
	});

	const blockByHeight = useBlock(network.name, { height_eq: parseInt(query) }, { skip: !maybeHeight });

	const extrinsicsByName = useExtrinsicsByName(network.name, query, "id_DESC", { skip: !maybeName });
	const eventsByName = useEventsByName(network.name, query, "id_DESC", { skip: !maybeName });

	const allResources = [extrinsicByHash, blockByHash, account, blockByHeight, extrinsicsByName, eventsByName];
	const multipleResultsResources = [extrinsicsByName, eventsByName];

	const showResults = multipleResultsResources.some(it => it.data?.length);
	const showLoading = forceLoading || (allResources.some(it => it.loading) && !showResults);
	const showNotFound = allResources.every(it => it.notFound);
	const error = allResources.find(it => it.error)?.error;
	const showError = error && allResources.every(it => it.error || it.notFound);

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setForceLoading(true);
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	useDOMEventTrigger("data-loaded", allResources.every(it => !it.loading));

	if (!query) {
		return <Navigate to="/" replace />;
	}

	if (!forceLoading) {
		if (extrinsicByHash.data) {
			return <Navigate to={`/extrinsic/${extrinsicByHash.data.id}`} replace />;
		}

		if (blockByHash.data || blockByHeight.data) {
			return <Navigate to={`/block/${blockByHash.data?.id || blockByHeight.data?.id}`} replace />;
		}

		if (account.data) {
			return <Navigate to={`/account/${account.data.id}`} replace />;
		}
	}

	if (showLoading) {
		return (
			<Card>
				<CardHeader css={loadingStyle}>
					Searching for <span css={queryStyle}>{query}</span>
				</CardHeader>
				<Loading />
			</Card>
		);
	}

	if (showNotFound) {
		return (
			<Card>
				<NotFound>Nothing was found for query <span css={queryStyle}>{query}</span></NotFound>
			</Card>
		);
	}

	if (showError && error) {
		return (
			<Card>
				<ErrorMessage
					message={<>Unexpected error occured while searching for <span css={queryStyle}>{query}</span></>}
					details={error.message}
					showReported
				/>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				Search results for query <span css={queryStyle}>{query}</span>
			</CardHeader>
			<TabbedContent>
				{!extrinsicsByName.notFound &&
					<TabPane
						label="Extrinsics"
						count={extrinsicsByName.pagination.totalCount}
						loading={extrinsicsByName.loading}
						error={extrinsicsByName.error}
						value="extrinsics"
					>
						<ExtrinsicsTable network={network.name} extrinsics={extrinsicsByName} showAccount showTime />
					</TabPane>
				}
				{!eventsByName.notFound &&
					<TabPane
						label="Events"
						count={eventsByName.pagination.totalCount}
						loading={eventsByName.loading}
						error={eventsByName.error}
						value="events"
					>
						<EventsTable network={network.name} events={eventsByName} showExtrinsic />
					</TabPane>
				}
			</TabbedContent>
		</Card>
	);
};
