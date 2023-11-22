import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import enGB from "date-fns/locale/en-GB";
import { format as formatTime, formatInTimeZone as formatTimeInTimeZone } from "date-fns-tz";
import { Tooltip } from "@mui/material";

export type TimeProps = {
	time: string|Date|number;
	format?: string;
	fromNow?: boolean;
	utc?: boolean;
	timezone?: boolean;
	tooltip?: boolean;
}

export const Time = (props: TimeProps) => {
	const {
		time,
		format: formatProp = "PP pp",
		utc = false,
		fromNow = false,
		timezone = utc,
		tooltip = false
	} = props;

	const [fromNowFormatted, setFromNowFormatted] = useState<string>();

	const formatted = useMemo(() => {
		let format = formatProp;

		if (timezone) {
			format += " (zzz)";
		}

		if (utc) {
			return formatTimeInTimeZone(new Date(time), "UTC", format, { locale: enGB });
		} else {
			return formatTime(new Date(time), format, { locale: enGB });
		}
	}, [time, formatProp, utc, timezone]);

	useEffect(() => {
		if (fromNow) {
			const interval = setInterval(() =>{
				setFromNowFormatted(
					formatDistanceToNowStrict(new Date(`${time}${utc ? "Z": ""}`), {
						addSuffix: true,
						locale: enGB,
					})
				);
			}
			);

			return () => clearInterval(interval);
		}
	}, [time, fromNow]);

	const timeElement = <span data-test="time">{fromNow ? fromNowFormatted : formatted}</span>;

	if (!tooltip) {
		return timeElement;
	}

	return (
		<Tooltip
			arrow
			placement="top"
			enterTouchDelay={0}
			title={formatted}
		>
			{timeElement}
		</Tooltip>
	);
};
