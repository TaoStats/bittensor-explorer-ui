import { Event } from "../../model/event";
import { Resource } from "../../model/resource";
import { getEventMetadataByName } from "../../utils/queryMetadata";
import { BlockTimestamp } from "../BlockTimestamp";

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
		event.data ? 
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
						<BlockTimestamp blockHeight={data.blockHeight} utc/>
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
						to={`/extrinsic/${data.blockHeight}-${data.extrinsicId}`}
					>
						{`${data.blockHeight}-${data.extrinsicId}`}
					</Link>
					}
					copyToClipboard={(data) => data.extrinsicId}
				/>
				<EventInfoTableAttribute
					label="Name"
					render={(data) =>
						<ButtonLink
							to={`/search?query=${data.module}.${data.event}`}
							size="small"
							color="secondary"
						>
							{data.module}.{data.event}
						</ButtonLink>
					}
				/>
				{/** FIXME: */}
				
				{/* <EventInfoTableAttribute
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
			</InfoTable>: <></>
	);
};
