export type DelegateAction = "DELEGATE" | "UNDELEGATE";

export type Delegate = {
	id: string;
	account: string;
	delegate: string;
	amount: bigint;
	blockNumber: bigint;
	extrinsicId: number;
	action: DelegateAction;
	delegateName?: string;
};

export type DelegateBalance = {
	id: string;
	account: string;
	delegate: string;
	amount: bigint;
	updatedAt: bigint;
	delegateName?: string;
	delegateFrom: bigint;
};

export type ValidatorBalance = {
	nodes: any;
};

export type DelegateInfo = {
	name: string;
	url: string;
	description: string;
	signature: string;
};
