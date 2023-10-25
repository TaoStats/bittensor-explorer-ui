import { useEffect, useState } from "react";
import { DelegateInfo } from "../model/delegate";
import { fetchVerifiedDelegates } from "../services/delegateService";

export function useVerifiedDelegates() {
	const [verifiedDelegates, setVerifiedDelegates] = useState<Record<string, DelegateInfo>>({});

	const getVerifiedDelegates = async () => {
		const delegates = await fetchVerifiedDelegates();
		setVerifiedDelegates(delegates);
	};

	useEffect(() => {
		getVerifiedDelegates();
	}, []);

	return verifiedDelegates;
}
