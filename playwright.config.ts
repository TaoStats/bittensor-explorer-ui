import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

type Config = PlaywrightTestConfig & {
	screenshotsDir: string;
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: Config = {
	testDir: "./test",
	outputDir: "./test/results",
	screenshotsDir: "./test/screenshots",
	/* Maximum time one test can run for. */
	timeout: 60 * 1000,
	expect: {
		/**
	 * Maximum time expect() should wait for the condition to be met.
	 * For example in `await expect(locator).toHaveText();`
	 */
		timeout: 5000
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests. */
	workers: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		["html", {
			outputFolder: "./test/report",
			open: "never"
		}]
	],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		baseURL: "http://localhost:3000",

		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,

		video: process.env.CI ? "retain-on-failure" : "on",
		trace: process.env.CI ? "retain-on-failure" : "on",

		testIdAttribute: "data-test",

		launchOptions: {
			devtools: process.env.PWDEBUG ? true : false
		}
	},
	/* Configure projects for major browsers */
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
			},
		},
		{
			name: "mobile",
			use: {
				...devices["iPhone SE"],
				defaultBrowserType: "chromium",
				deviceScaleFactor: 1
			},
		},
	],
	globalSetup: "./test/global-setup.ts"
};

export default config;
