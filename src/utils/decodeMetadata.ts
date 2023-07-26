import { TypeRegistry, Metadata, PortableRegistry } from "@polkadot/types";
import { Si1Variant } from "@polkadot/types/interfaces";
import { getSiName } from "@polkadot/types/metadata/util";
import { DecodedCall, DecodedEvent, DecodedMetadata, DecodedPallet } from "../model/decodedMetadata";

const toCamelCase = (str: string) => str.toLowerCase().replace(/([-_][a-z])/g, group =>
	group
		.toUpperCase()
		.replace("-", "")
		.replace("_", "")
);

function decodeCall(lookup: PortableRegistry, call: Si1Variant) {
	const { fields } = call;

	const decodedCall: DecodedCall = {
		name: toCamelCase(call.name.toString()),
		args: []
	};

	decodedCall.args = fields.map((field, index) => ({
		name: field.name.unwrapOr(index).toString(),
		type: getSiName(lookup, field.type),
		typeName: field.typeName.isSome
			? field.typeName.unwrap().toString()
			: undefined
	}));

	return decodedCall;
}

function decodeEvent(lookup: PortableRegistry, event: Si1Variant) {
	const { fields } = event;

	const decodedEvent: DecodedEvent = {
		name: event.name.toString(),
		args: []
	};

	decodedEvent.args = fields.map((field, index) => ({
		name: field.name.unwrapOr(index).toString(),
		type: getSiName(lookup, field.type),
		typeName: field.typeName.isSome
			? field.typeName.unwrap().toString()
			: undefined
	}));

	return decodedEvent;
}

export function decodeMetadata(hex: `0x${string}`) {
	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, hex);
	registry.setMetadata(metadata);

	const latestMetadata = metadata.asLatest;
	const ss58Prefix = latestMetadata.registry.getChainProperties()?.ss58Format.unwrap()?.toNumber();

	const decodedMetadata: DecodedMetadata = {
		ss58Prefix: typeof ss58Prefix === "number" ? ss58Prefix : 42,
		pallets: []
	};

	decodedMetadata.pallets = latestMetadata.pallets.map(pallet => {
		const decodedPallet: DecodedPallet = {
			name: pallet.name.toString(),
			calls: [],
			events: [],
		};

		if (pallet.calls.isSome) {
			const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;
			decodedPallet.calls = calls.map(call => decodeCall(latestMetadata.lookup, call));
		}

		if (pallet.events.isSome) {
			const events = latestMetadata.lookup.getSiType(pallet.events.unwrap().type).def.asVariant.variants;
			decodedPallet.events = events.map(event => decodeEvent(latestMetadata.lookup, event));
		}

		return decodedPallet;
	});

	return decodedMetadata;
}
