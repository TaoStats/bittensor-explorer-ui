import { useBlock } from "../../hooks/useBlock";
import { useRuntimeSpec } from "../../hooks/useRuntimeSpec";
import { Event } from "../../model/event";
import { Resource } from "../../model/resource";
import { getEventMetadataByName } from "../../utils/queryMetadata";
import { BlockTimestamp } from "../BlockTimestamp";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";

export type EventInfoTableProps = {
	event: Resource<Event>;
}

const EventInfoTableAttribute = InfoTableAttribute<Event>;

export const EventInfoTable = (props: EventInfoTableProps) => {
	const { event } = props;
	const block = useBlock({ id: { equalTo: event.data?.blockHeight } });
	const { runtimeSpec, loading: loadingRuntimeSpec } = useRuntimeSpec(
		block.data?.specVersion
	);

	return event.data ? (
		<InfoTable
			data={event.data}
			loading={event.loading}
			notFound={event.notFound}
			notFoundMessage='No event found'
			error={event.error}
		>
			<EventInfoTableAttribute
				label='Timestamp'
				render={(data) => <BlockTimestamp blockHeight={data.blockHeight} utc />}
			/>
			<EventInfoTableAttribute
				label='Block'
				render={(data) => (
					<Link to={`/block/${data.blockHeight.toString()}`}>
						{data.blockHeight.toString()}
					</Link>
				)}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<EventInfoTableAttribute
				label='Extrinsic'
				render={(data) =>
					data.extrinsicId != null && (
						<Link to={`/extrinsic/${data.blockHeight}-${data.extrinsicId}`}>
							{`${data.blockHeight}-${data.extrinsicId}`}
						</Link>
					)
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			<EventInfoTableAttribute
				label='Name'
				render={(data) => (
					<ButtonLink
						to={`/search?query=${data.module}.${data.event}`}
						size='small'
						color='secondary'
					>
						{data.module}.{data.event}
					</ButtonLink>
				)}
			/>
			{!loadingRuntimeSpec && runtimeSpec ? (
				<EventInfoTableAttribute
					label='Parameters'
					render={(data) => (
						<DataViewer
							data={data.data}
							metadata={
								getEventMetadataByName(
									runtimeSpec.metadata,
									data.module,
									data.event
								)?.args
							}
							runtimeSpec={runtimeSpec}
							copyToClipboard
						/>
					)}
					hide={(data) => !data.data}
				/>
			) : (
				<></>
			)}
		</InfoTable>
	) : (
		<></>
	);
};
