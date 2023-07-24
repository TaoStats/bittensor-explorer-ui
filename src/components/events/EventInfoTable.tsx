import { Event } from "../../model/event";
import { Resource } from "../../model/resource";
import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type EventInfoTableProps = {
	event: Resource<Event>;
}

const EventInfoTableAttribute = InfoTableAttribute<Event>;

export const EventInfoTable = (props: EventInfoTableProps) => {
	const {event} = props;

	return (
		<InfoTable
			data={event.data}
			loading={event.loading}
			notFound={event.notFound}
			notFoundMessage="No event found"
			error={event.error}
		>
			<EventInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
			/>
			<EventInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<EventInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link
						to={`/block/${data.blockHeight.toString()}`}
					>
						{data.blockHeight.toString()}
					</Link>
				}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<EventInfoTableAttribute
				label="Extrinsic"
				render={(data) => data.extrinsicId != null &&
					<Link
						to={`/extrinsic/${data.extrinsicId}`}
					>
						{data.extrinsicId}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			{/** FIXME: */}
			{/* <EventInfoTableAttribute
				label="Call"
				render={(data) => data.callId &&
					<Link
						to={`/call/${data.callId}`}
					>
						{data.callId}
					</Link>
				}
				copyToClipboard={(data) => data.callId}
			/> */}
			{/* <EventInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/search?query=${data.palletName}.${data.eventName}`}
						size="small"
						color="secondary"
					>
						{data.palletName}.{data.eventName}
					</ButtonLink>
				}
			/>
			<EventInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						data={data.args}
						metadata={getEventMetadataByName(data.runtimeSpec.metadata, data.palletName, data.eventName)?.args}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
				hide={(data) => !data.args}
			/> */}
			<EventInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
