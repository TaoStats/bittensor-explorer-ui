import { useEffect, useState } from "react";
import { useApi } from "../contexts";

export function useSubnetEmissions() {
	const {
		state: { api, apiState },
	} = useApi();
	const [emissions, setEmissions] = useState<any>(undefined);

	const fetchSubnetEmissions = async () => {
		if (!api || apiState !== "READY") return;
		const res = await api.query.subtensorModule.emissionValues.entries();
		const emi = res.reduce((emi: any, [key, value]: any) => {
			const [id] = key.toHuman();
			const uid = parseInt(id);
			const emission = value.toJSON();
			emi[uid] = emission;
			return emi;
		}, {});
		setEmissions(emi);
	};

	useEffect(() => {
		fetchSubnetEmissions(); 
	}, [apiState]);

	return emissions;
}
