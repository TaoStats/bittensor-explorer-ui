import styled from "@emotion/styled";
import { Straight } from "@mui/icons-material";

export const Ascending = Straight;

export const Descending = styled(Ascending)`
	transform: scaleY(-1);
`;

export const Unsorted = () => (
	<>
		<Ascending />
		<Descending style={{marginLeft: -8}} />
	</>
);
