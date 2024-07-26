import { useBlock, useRuntimeSpec } from "../../hooks";
import { Resource, Event } from "../../model";
import { getEventMetadataByName } from "../../utils";
import { InfoTableAttribute, InfoTable, BlockTimestamp, ButtonLink, Link } from "../elements";
import { DataViewer } from "../elements/DataViewer";

export type EventInfoTableProps = {
	event: Resource<Event>;
};

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
			notFoundMessage="No event found"
			error={event.error}
		>
			<EventInfoTableAttribute
				label="Timestamp"
				render={(data) => <BlockTimestamp blockHeight={data.blockHeight} utc />}
			/>
			<EventInfoTableAttribute
				label="Block"
				render={(data) => (
					<Link to={`/block/${data.blockHeight.toString()}`}>
						{data.blockHeight.toString()}
					</Link>
				)}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<EventInfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					data.extrinsicId !== "-1" ? (
						<Link to={`/extrinsic/${data.blockHeight}-${data.extrinsicId}`}>
							{`${data.blockHeight}-${data.extrinsicId}`}
						</Link>
					) : (
						"System Event"
					)
				}
				copyToClipboard={(data) =>
					data.extrinsicId !== "-1" ? data.extrinsicId : undefined
				}
			/>
			<EventInfoTableAttribute
				label="Name"
				render={(data) => (
					<ButtonLink
						to={`/search?query=${data.module}.${data.event}`}
						size="small"
						color="secondary"
					>
						{data.module}.{data.event}
					</ButtonLink>
				)}
			/>
			{!loadingRuntimeSpec && runtimeSpec ? (
				<EventInfoTableAttribute
					label="Parameters"
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
