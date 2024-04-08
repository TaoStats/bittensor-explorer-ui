import TaoIcon from "../assets/tao_icon.png";

export const Footer = () => {
	return (
		<footer className="new-site-footer">
			<div className="container">
				<div className="footer-cover">
					<div className="footer-top">
						<div className="ft-left">
							<div className="logo-tegline">
								<img src={TaoIcon} /> Powered by Bittensor
							</div>
							<p>
								τaostats is a Block Explorer and Analytics Platform for
								Bittensor, a decentralized machine learning network.
							</p>
							<p>This site is not affiliated with the Opentensor Foundation.</p>
							<p>
								The content of this website is provided for information purposes
								only.
								<br />
								No claim is made as to the accuracy or currency of the content
								on this site at any time.
							</p>
							<p>
								τaosτaτs is created and maintained by{" "}
								<a
									href="https://twitter.com/mogmachine"
									target="_blank"
									rel="noreferrer"
								>
									mogmachine
								</a>
								. We hope you found it helpful, if you have any suggestions or
								issues please contact us at{" "}
								<a href="mailto:taostats@mogmachine.com">
									taostats@mogmachine.com
								</a>
								.
							</p>
						</div>
						<div className="ft-right">
							<div className="f-col">
								<h5>Apps</h5>
								<ul>
									<li>
										<a href="https://app.corcel.io/chat">Corcel Chat</a>
									</li>
									<li>
										<a href="https://app.corcel.io/image-studio">
											Corcel Image Studio
										</a>
									</li>
								</ul>
								<h5>Developers</h5>
								<ul>
									<li>
										<a href="https://corcel.io/">Corcel</a>
									</li>
									<li>
										<a href="https://taostats.io/api/">Taostats API</a>
									</li>
								</ul>
							</div>
							<div className="f-col">
								<h5>Blockchain</h5>
								<ul>
									<li>
										<a href="/#accounts">Accounts</a>
									</li>
									<li>
										<a href="/#transfers">Transfers</a>
									</li>
									<li>
										<a href="/#blocks">Blocks</a>
									</li>
									<li>
										<a href="https://taostats.io/tokenomics/">Tokenomics</a>
									</li>
									<li>
										<a href="https://nx.taostats.io/">Nakamoto</a>
									</li>
									<li>
										<a href="https://kx.taostats.io/">Kusanagi</a>
									</li>
								</ul>
							</div>
							<div className="f-col">
								<h5>Validators</h5>
								<ul>
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
								<h5>Resources</h5>
								<ul>
									<li className="">
										<a href="https://taostats.io/links/">Links</a>
									</li>
									<li className="">
										<a href="https://taostats.io/media/">Media</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="footer-bottom">
						<div className="copyright">
							<p>Taostats © 2024.</p>
						</div>
						<p>
							Taostats is funded by public delegation. Support us by delegating{" "}
							<a
								href="https://delegate.taostats.io/staking?hkey=5Hddm3iBFD2GLT5ik7LZnT3XJUnRnN8PoeCFgGQgawUVKNm8"
								style={{ color: "#14dec2" }}
							>
								stake to the taostats.io validator
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
