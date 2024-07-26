export interface ExtrinsicResponse {
    id: string;
    module: string;
    call: string;
    blockHeight: bigint;
    success: boolean;
    isSigned: boolean;
    txHash: string;
    args: string;
    nonce: number;
    signer: string;
    version: number;
    tip: bigint;
    blockId: string;
}

export interface Extrinsic extends Omit<ExtrinsicResponse, "args"> {
    args: string[];
}
