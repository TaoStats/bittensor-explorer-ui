import { useState } from "react";
import Logo from "../assets/logo.png";
import PolygonGray from "../assets/polygon-gray.svg";
import { useAppStats } from "../contexts";
import { nFormatter } from "../utils/number";
import subnetNames from "../subnets_names.json";

export const Header = () => {
	const {
		state: { tokenStats },
	} = useAppStats();
	const price = tokenStats?.price ?? 0;
	const priceChange24h = tokenStats?.priceChange24h ?? 0;
	const volume24h = tokenStats?.volume24h ?? 0;
	const marketCap = tokenStats?.marketCap ?? 0;

	const [isFaded, setFaded] = useState(false);

	const toggleFade = () => {
		setFaded(!isFaded);
	};

	const openSubMenu = (
		event: React.MouseEvent<HTMLSpanElement, MouseEvent>
	) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event.target as any).parentElement.classList.toggle("open-menu");
		event.preventDefault();
	};
	
	const subnetIDs = Object.keys(subnetNames);
	const totalSubnets = subnetIDs.length;
	const subnetMenuColumn = 3;

	return (
		<header className="new-site-header">
			<div className="header-top">
				<div className="container">
					<div className="ht-inner">
						<div className="ht-left">
							<ul>
								<li>
									<label>Price.</label> ${price}{" "}
									<span
										className={`${
											priceChange24h > 0
												? "up"
												: priceChange24h < 0
													? "down"
													: ""
										}`}
									>
										{priceChange24h > 0 ? "▴" : priceChange24h < 0 ? "▾" : ""}
										{` ${priceChange24h}%`}
									</span>
								</li>
								<li>
									<label>24 Vol.</label> ${nFormatter(volume24h, 2)}
								</li>
								<li>
									<label>Market Cap</label> ${nFormatter(marketCap, 2)}
								</li>
							</ul>
						</div>
						<div className="ht-right">
							<div className="ht-search">
								<form action="/search" method="get">
									<input
										type="text"
										name="query"
										id="query"
										placeholder="Search by Address / Validator /Txn Hash"
									/>
									<input type="submit" value="" />
								</form>
							</div>
							<div className="ht-btns">
								<a
									href="https://delegate.taostats.io"
									target="_blank"
									className="btn"
									rel="noreferrer"
								>
									STAKE TAO
								</a>
								<div className="menu-dropdown">
									<a href="#" className="btn">
										BUY TAO
										<span>
											<img src={PolygonGray} alt="Taostats down caret" />
										</span>
									</a>
									<ul className="menu">
										<li>
											<a
												href="https://www.mexc.com/register?inviteCode=1M9bg"
												target="_blank"
												rel="noreferrer"
											>
												MEXC
											</a>
										</li>
										<li>
											<a
												href="https://www.gate.io/trade/TAO_USDT?ref=A1QSXVla&amp;ref_type=106"
												target="_blank"
												rel="noreferrer"
											>
												GATE.IO
											</a>
										</li>
										<li>
											<a
												href="https://partner.bitget.com/bg/X0Z47N"
												target="_blank"
												rel="noreferrer"
											>
												BITGET
											</a>
										</li>
										<li>
											<a
												href="https://tensor.exchange/"
												target="_blank"
												rel="noreferrer"
											>
												TENSOR EXCHANGE
											</a>
										</li>
										<li>
											<a
												href="https://app.uniswap.org/#/swap?outputCurrency=0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44"
												target="_blank"
												rel="noreferrer"
											>
												UNISWAP(WTAO)
											</a>
										</li>
									</ul>
								</div>
								<a
									href="https://bitapai.io"
									target="_blank"
									className="btn"
									rel="noreferrer"
								>
									<img
										src="https://app.bitapai.io/images/logo.png"
										data-xblocker="passed"
										style={{ visibility: "visible" }}
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="header-bottom">
				<div className="container">
					<div className="hb-inner">
						<div className="logo">
							<a href="https://taostats.io">
								<img src={Logo} alt="Taostats Logo" />
							</a>
						</div>
						<div
							className="menuBtn"
							onClick={() => {
								document.body.classList.toggle("active-menu");
								toggleFade();
							}}
						>
							<span></span>
							<span></span>
							<span></span>
						</div>

						<div className={`main-menu fade-in-out ${isFaded ? "active" : ""}`}>
							<div className="container">
								<div className="ht-search">
									<form action="/search" method="get">
										<input
											type="text"
											name="query"
											id="mobile-query"
											placeholder="Search by Address / Validator /Txn Hash"
										/>
										<input type="submit" value="" />
									</form>
								</div>
								<nav>
									<ul>
										<li className="menu-item">
											<a href="https://taostats.io">Home</a>
											<span className="menuItem-glow"></span>
										</li>
										<li className="menu-item-has-children">
											<a href="https://taostats.io/subnets/">
												Subnets
												<span
													className="has-btn"
													onClick={(e) => openSubMenu(e)}
												></span>
											</a>
											<ul className="megaMenu subMenu">
												{
													Array.from(Array(3)).map((_, menuIndex) => (
														<li key={`subnet-menu-column-${menuIndex}`}>
															<ul>
																{
																	Array.from(Array(Math.floor((totalSubnets + 2 - menuIndex) / subnetMenuColumn))).map((_, itemIndex) => {
																		let passed = 0;
																		for(let i = 0; i < menuIndex; i ++) {
																			passed += Math.floor((totalSubnets + 2 - i) / subnetMenuColumn);
																		}
																		const netUid = parseInt(subnetIDs[passed + itemIndex] ?? "0");
																		const name = (subnetNames as any)[netUid];
																		return (
																			<li key={`subnet-menu-item-${itemIndex}`}>
																				<a href={"https://taostats.io/subnets/netuid-" + netUid}>
																					{netUid < 10 ? "0" : ""}{netUid} - {name}
																				</a>
																			</li>
																		);
																	})
																}
															</ul>
														</li>
													))
												}
											</ul>
											<span className="menuItem-glow"></span>
										</li>
										<li className="current-menu-item menu-item-has-children">
											<a href="/">
												Blockchain
												<span
													className="has-btn"
													onClick={(e) => openSubMenu(e)}
												></span>
											</a>
											<ul className="subMenu">
												<li>
													<a href="/#accounts">Accounts</a>
												</li>
												<li>
													<a href="/#transfers">
														Transfers
													</a>
												</li>
												<li>
													<a href="/#blocks">Blocks</a>
												</li>
												<li>
													<a href="https://taostats.io/tokenomics/">
														Tokenomics
													</a>
												</li>
												<li>
													<a href="https://nx.taostats.io/">
														Nakamoto
													</a>
												</li>
												<li>
													<a href="https://kx.taostats.io/">
														Kusanagi
													</a>
												</li>
											</ul>
											<span className="menuItem-glow"></span>
										</li>
										<li className="menu-item-has-children">
											<a href="https://taostats.io/verified-validators/">
												Validators
												<span
													className="has-btn"
													onClick={(e) => openSubMenu(e)}
												></span>
											</a>
											<ul className="subMenu">
												<li>
													<a href="https://taostats.io/verified-validators/">
														Verified Validators
													</a>
												</li>
												<li>
													<a href="https://taostats.io/staking/">
														Delegation/Staking
													</a>
												</li>
											</ul>
											<span className="menuItem-glow"></span>
										</li>
										<li className="menu-item-has-children">
											<a href="https://taostats.io/developers/">
												Developers
												<span
													className="has-btn"
													onClick={(e) => openSubMenu(e)}
												></span>
											</a>
											<ul className="subMenu">
												<li>
													<a href="https://bitapai.io/">BitAPAI</a>
												</li>
												<li>
													<a href="https://taostats.io/api/">Taostats API</a>
												</li>
											</ul>
											<span className="menuItem-glow"></span>
										</li>
										<li className="menu-item-has-children">
											<a href="#">
												Resources
												<span
													className="has-btn"
													onClick={(e) => openSubMenu(e)}
												></span>
											</a>
											<ul className="subMenu">
												<li className="">
													<a href="https://taostats.io/links/">Links</a>
												</li>
												<li className="">
													<a href="https://taostats.io/media/">Media</a>
												</li>
											</ul>
											<span className="menuItem-glow"></span>
										</li>
									</ul>
								</nav>
								<div className="ht-btns">
									<a href="https://delegate.taostats.io" className="btn">
										Stake Tao
									</a>
									<div className="menu-dropdown">
										<a href="#" className="btn">
											BUY TAO
											<span>
												<img src={PolygonGray} alt="Taostats down caret" />
											</span>
										</a>
										<ul className="menu">
											<li>
												<a
													href="https://www.mexc.com/register?inviteCode=1M9bg"
													target="_blank"
													rel="noreferrer"
												>
													MEXC
												</a>
											</li>
											<li>
												<a
													href="https://www.gate.io/trade/TAO_USDT?ref=A1QSXVla&amp;ref_type=106"
													target="_blank"
													rel="noreferrer"
												>
													GATE.IO
												</a>
											</li>
											<li>
												<a
													href="https://partner.bitget.com/bg/X0Z47N"
													target="_blank"
													rel="noreferrer"
												>
													BITGET
												</a>
											</li>
											<li>
												<a
													href="https://tensor.exchange/"
													target="_blank"
													rel="noreferrer"
												>
													TENSOR EXCHANGE
												</a>
											</li>
											<li>
												<a
													href="https://app.uniswap.org/#/swap?outputCurrency=0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44"
													target="_blank"
													rel="noreferrer"
												>
													UNISWAP(WTAO)
												</a>
											</li>
										</ul>
									</div>
									<a
										href="https://bitapai.io"
										target="_blank"
										className="btn"
										rel="noreferrer"
									>
										<img
											src="https://app.bitapai.io/images/logo.png"
											data-xblocker="passed"
											style={{ visibility: "visible" }}
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
