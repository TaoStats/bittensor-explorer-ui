/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortOrder } from "../../model/sortOrder";
import { SortDirection } from "../../model/sortDirection";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NeuronMetagraphOrder } from "../../services/subnetsService";
import { NeuronMetagraph } from "../../model/subnet";
import { NETWORK_CONFIG } from "../../config";
import {
	formatNumber,
	shortenIP,
	rawAmountToDecimal,
	rawAmountToDecimalBy,
} from "../../utils/number";
import { shortenHash } from "../../utils/shortenHash";
import { useTaoPrice } from "../../hooks/useTaoPrice";
import { useAppStats } from "../../contexts";
import CheckShield from "../../assets/check-shield.svg";
import Certification from "../../assets/certification.svg";
import Spinner from "../Spinner";
import { css } from "@emotion/react";

const orangeText = css`
	color: #ff9900;
`;
const whiteText = css`
	color: #ffffff;
`;
const boldText = css`
	font-weight: bold;
`;
const iconContainer = css`
	display: flex;
	flex-direction: row;
	gap: 5px;
	align-items: center;
`;

export type NeuronMetagraphTableProps = {
	metagraph: PaginatedResource<NeuronMetagraph>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: NeuronMetagraphOrder) => void;
	initialSort?: string;
	onSearchChange?: (newSearch?: string) => void;
	initialSearch?: string;
	showAll?: boolean;
};

const NeuronMetagraphTableAttribute = ItemsTableAttribute<NeuronMetagraph>;

const orderMappings = {
	uid: {
		[SortDirection.ASC]: "UID_ASC",
		[SortDirection.DESC]: "UID_DESC",
	},
	stake: {
		[SortDirection.ASC]: "STAKE_ASC",
		[SortDirection.DESC]: "STAKE_DESC",
	},
	vTrust: {
		[SortDirection.ASC]: "VALIDATOR_TRUST_ASC",
		[SortDirection.DESC]: "VALIDATOR_TRUST_DESC",
	},
	trust: {
		[SortDirection.ASC]: "TRUST_ASC",
		[SortDirection.DESC]: "TRUST_DESC",
	},
	consensus: {
		[SortDirection.ASC]: "CONSENSUS_ASC",
		[SortDirection.DESC]: "CONSENSUS_DESC",
	},
	incentive: {
		[SortDirection.ASC]: "INCENTIVE_ASC",
		[SortDirection.DESC]: "INCENTIVE_DESC",
	},
	dividends: {
		[SortDirection.ASC]: "DIVIDENDS_ASC",
		[SortDirection.DESC]: "DIVIDENDS_DESC",
	},
	emission: {
		[SortDirection.ASC]: "EMISSION_ASC",
		[SortDirection.DESC]: "EMISSION_DESC",
	},
	updated: {
		[SortDirection.ASC]: "LAST_UPDATE_DESC",
		[SortDirection.DESC]: "LAST_UPDATE_ASC",
	},
	active: {
		[SortDirection.ASC]: "ACTIVE_ASC",
		[SortDirection.DESC]: "ACTIVE_DESC",
	},
	axon: {
		[SortDirection.ASC]: "AXON_IP_ASC",
		[SortDirection.DESC]: "AXON_IP_DESC",
	},
	hotkey: {
		[SortDirection.ASC]: "HOTKEY_ASC",
		[SortDirection.DESC]: "HOTKEY_DESC",
	},
	coldkey: {
		[SortDirection.ASC]: "COLDKEY_ASC",
		[SortDirection.DESC]: "COLDKEY_DESC",
	},
	dailyReward: {
		[SortDirection.ASC]: "DAILY_REWARD_ASC",
		[SortDirection.DESC]: "DAILY_REWARD_DESC",
	},
	dailyDollar: {
		[SortDirection.ASC]: "DAILY_REWARD_ASC",
		[SortDirection.DESC]: "DAILY_REWARD_DESC",
	},
	totalDollar: {
		[SortDirection.ASC]: "STAKE_ASC",
		[SortDirection.DESC]: "STAKE_DESC",
	},
};

function NeuronMetagraphTable(props: NeuronMetagraphTableProps) {
	const { metagraph, showAll } = props;

	const taoPrice = useTaoPrice();
	const {
		state: { chainStats },
	} = useAppStats();

	const { initialSort, onSortChange, initialSearch, onSearchChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();
	const [search, setSearch] = useState(initialSearch);

	useEffect(() => {
		Object.entries(orderMappings).forEach(([property, value]) => {
			Object.entries(value).forEach(([dir, orderKey]) => {
				if (orderKey === initialSort) {
					setSort({
						property,
						direction: dir === "1" ? SortDirection.ASC : SortDirection.DESC,
					});
				}
			});
		});
	}, [initialSort]);

	const handleSortChange = (property?: string) => {
		if (!property) return;
		if (property === sort?.property) {
			setSort({
				...sort,
				direction:
					sort.direction === SortDirection.ASC
						? SortDirection.DESC
						: SortDirection.ASC,
			});
		} else {
			setSort({
				property,
				direction: SortDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!onSortChange || !sort?.property || sort.direction === undefined)
			return;
		onSortChange((orderMappings as any)[sort.property][sort.direction]);
	}, [JSON.stringify(sort)]);

	const handleSearchChange = (value?: string) => {
		setSearch(value);
	};

	useEffect(() => {
		if (!onSearchChange) return;
		onSearchChange(search);
	}, [search]);

	const data = useMemo(() => {
		if (metagraph.loading || !metagraph.data) return [];

		const result: NeuronMetagraph[] = [];
		if (showAll) {
			const { dailyReward, stake } = metagraph.data.reduce(
				(
					{ dailyReward, stake }: { dailyReward: bigint; stake: bigint },
					cur
				) => {
					return {
						dailyReward: dailyReward + BigInt(cur.dailyReward),
						stake: stake + BigInt(cur.stake),
					};
				},
				{
					dailyReward: BigInt(0),
					stake: BigInt(0),
				}
			);
			result.push({
				id: "total",
				emission: BigInt(-1),
				dailyReward,
				stake,
			} as NeuronMetagraph);
		}

		return [...metagraph.data, ...result];
	}, [metagraph, showAll]);

	return (
		<ItemsTable
			data={data}
			loading={metagraph.loading}
			notFound={metagraph.notFound}
			notFoundMessage="No metagraph records."
			error={metagraph.error}
			pagination={showAll ? undefined : metagraph.pagination}
			data-test="metagraph-table"
			sort={sort}
			onSortChange={handleSortChange}
			search={search}
			onSearchChange={handleSearchChange}
			searchBackground="#1a1a1a"
			showRank={!showAll}
			rankLabel="POS"
		>
			<NeuronMetagraphTableAttribute
				label=""
				render={(data) => (
					<div css={iconContainer}>
						{data.validatorPermit && <img src={CheckShield} alt="validator" />}
						{data.isImmunityPeriod && (
							<img src={Certification} alt="immunity" />
						)}
					</div>
				)}
			/>
			<NeuronMetagraphTableAttribute
				label="uid"
				sortable
				render={(data) =>
					data.emission >= 0 ? (
						<Link
							to={`/hotkey/${data.hotkey}`}
							css={boldText}
						>
							{data.uid}
						</Link>
					) : (
						"Total"
					)
				}
				sortProperty="uid"
			/>
			<NeuronMetagraphTableAttribute
				label={`${NETWORK_CONFIG.currency}stake`}
				sortable
				render={(data) => (
					<span css={orangeText}>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimal(data.stake.toString()), {
								decimalPlaces: 0,
							})}
					</span>
				)}
				sortProperty="stake"
			/>
			<NeuronMetagraphTableAttribute
				label="vTrust"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimalBy(data.validatorTrust, 65535), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="vTrust"
			/>
			<NeuronMetagraphTableAttribute
				label="trust"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimalBy(data.trust, 65535), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="trust"
			/>
			<NeuronMetagraphTableAttribute
				label="consensus"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimalBy(data.consensus, 65535), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="consensus"
			/>
			<NeuronMetagraphTableAttribute
				label="incentive"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimalBy(data.incentive, 65535), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="incentive"
			/>
			<NeuronMetagraphTableAttribute
				label="dividends"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimalBy(data.dividends, 65535), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="dividends"
			/>
			<NeuronMetagraphTableAttribute
				label="emission(p)"
				sortable
				render={(data) => (
					<>
						{data.emission >= 0 &&
							formatNumber(rawAmountToDecimal(data.emission.toString()), {
								decimalPlaces: 5,
							})}
					</>
				)}
				sortProperty="emission"
			/>
			<NeuronMetagraphTableAttribute
				label="updated"
				sortable
				render={(data) => (
					<span css={whiteText}>
						{data.emission >= 0 &&
							(chainStats ? parseInt(chainStats.blocksFinalized.toString()) - data.lastUpdate : 0)}
					</span>
				)}
				sortProperty="updated"
			/>
			<NeuronMetagraphTableAttribute
				label="active"
				sortable
				render={(data) => <>{data.emission >= 0 && (data.active ? 1 : 0)}</>}
				sortProperty="active"
			/>
			<NeuronMetagraphTableAttribute
				label="axon"
				sortable
				render={(data) => <>{data.emission >= 0 && shortenIP(data.axonIp)}</>}
				sortProperty="axon"
			/>
			<NeuronMetagraphTableAttribute
				label="hotkey"
				sortable
				render={(data) => (
					<Link to={`/account/${data.hotkey}`} color="white">
						{shortenHash(data.hotkey, true, false)}
					</Link>
				)}
				sortProperty="hotkey"
			/>
			<NeuronMetagraphTableAttribute
				label="coldkey"
				sortable
				render={(data) => (
					<Link to={`/account/${data.coldkey}`} color="white">
						{shortenHash(data.coldkey, true, false)}
					</Link>
				)}
				sortProperty="coldkey"
			/>
			<NeuronMetagraphTableAttribute
				label={`daily ${NETWORK_CONFIG.currency}`}
				sortable
				render={(data) => (
					<span css={orangeText}>
						{formatNumber(rawAmountToDecimal(data.dailyReward.toString()), {
							decimalPlaces: 3,
						})}
					</span>
				)}
				sortProperty="dailyReward"
			/>
			<NeuronMetagraphTableAttribute
				label="daily $"
				sortable
				render={(data) =>
					taoPrice.loading ? (
						<Spinner small />
					) : (
						<span css={whiteText}>
							$
							{formatNumber(
								rawAmountToDecimal(data.dailyReward.toString()).mul(
									taoPrice.data || 0
								),
								{
									decimalPlaces: 2,
								}
							)}
						</span>
					)
				}
				sortProperty="dailyDollar"
			/>
			<NeuronMetagraphTableAttribute
				label="total $"
				sortable
				render={(data) =>
					taoPrice.loading ? (
						<Spinner small />
					) : (
						<span css={whiteText}>
							$
							{formatNumber(
								rawAmountToDecimal(data.stake.toString()).mul(
									taoPrice.data || 0
								),
								{
									decimalPlaces: 0,
								}
							)}
						</span>
					)
				}
				sortProperty="totalDollar"
			/>
		</ItemsTable>
	);
}

export default NeuronMetagraphTable;
