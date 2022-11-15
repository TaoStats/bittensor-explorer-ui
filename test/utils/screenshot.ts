import path from "path";
import { Page } from "@playwright/test";

import config from "../../playwright.config";

const hideSelectors = [
	".MuiTabs-indicator",
	"[data-test=count]",
	"[data-test=time]"
];

export async function screenshot(page: Page, name: string) {
	page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "relative";
		}

		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "absolute";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "none";
			}
		}
	}, hideSelectors);

	await page.screenshot({
		path: path.join(config.testDir!, "screenshots", `${name}.png`),
		fullPage: true,
		animations: "disabled"
	});

	page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "";
		}

		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "";
			}
		}
	}, hideSelectors);
}