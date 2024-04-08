/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
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
	const { metagraph } = props;

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

	return (
		<ItemsTable
			data={metagraph.data}
			loading={metagraph.loading}
			notFound={metagraph.notFound}
			notFoundMessage="No metagraph records."
			error={metagraph.error}
			pagination={metagraph.pagination}
			data-test="metagraph-table"
			sort={sort}
			onSortChange={handleSortChange}
			search={search}
			onSearchChange={handleSearchChange}
			searchBackground="#1a1a1a"
			showRank
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
				render={(data) => (
					<Link
						to={`https://taostats.io/hotkey/?hkey=${data.hotkey}`}
						css={boldText}
					>
						{data.uid}
					</Link>
				)}
				sortProperty="uid"
			/>
			<NeuronMetagraphTableAttribute
				label={`${NETWORK_CONFIG.currency}stake`}
				sortable
				render={(data) => (
					<span css={orangeText}>
						{formatNumber(rawAmountToDecimal(data.stake.toString()), {
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
						{formatNumber(
							rawAmountToDecimalBy(data.validatorTrust.toString(), 65535),
							{
								decimalPlaces: 5,
							}
						)}
					</>
				)}
				sortProperty="vTrust"
			/>
			<NeuronMetagraphTableAttribute
				label="trust"
				sortable
				render={(data) => (
					<>
						{formatNumber(rawAmountToDecimalBy(data.trust.toString(), 65535), {
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
						{formatNumber(
							rawAmountToDecimalBy(data.consensus.toString(), 65535),
							{
								decimalPlaces: 5,
							}
						)}
					</>
				)}
				sortProperty="consensus"
			/>
			<NeuronMetagraphTableAttribute
				label="incentive"
				sortable
				render={(data) => (
					<>
						{formatNumber(
							rawAmountToDecimalBy(data.incentive.toString(), 65535),
							{
								decimalPlaces: 5,
							}
						)}
					</>
				)}
				sortProperty="incentive"
			/>
			<NeuronMetagraphTableAttribute
				label="dividends"
				sortable
				render={(data) => (
					<>
						{formatNumber(
							rawAmountToDecimalBy(data.dividends.toString(), 65535),
							{
								decimalPlaces: 5,
							}
						)}
					</>
				)}
				sortProperty="dividends"
			/>
			<NeuronMetagraphTableAttribute
				label="emission(p)"
				sortable
				render={(data) => (
					<>
						{formatNumber(rawAmountToDecimal(data.emission.toString()), {
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
						{chainStats
							? parseInt(chainStats.blocksFinalized.toString()) -
							data.lastUpdate
							: 0}
					</span>
				)}
				sortProperty="updated"
			/>
			<NeuronMetagraphTableAttribute
				label="active"
				sortable
				render={(data) => <>{data.active ? 1 : 0}</>}
				sortProperty="active"
			/>
			<NeuronMetagraphTableAttribute
				label="axon"
				sortable
				render={(data) => <>{shortenIP(data.axonIp)}</>}
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
