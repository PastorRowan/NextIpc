
import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests-out/e2e",          // Where your E2E tests live
    timeout: 30000,                  // Max time one test can run
    retries: 1,                     // Retry once on failure
    reporter: "list",               // Output test results as a list
    use: {
        headless: true,               // Run Electron in headless mode (no GUI)
        ignoreHTTPSErrors: true,
        video: "off",
    },

    projects: [
        {
            name: "electron",
            use: {
                // Launch your Electron app here
                // This example assumes your main entry is in the project root
                launchOptions: {
                args: ["."],
                // Optionally add env vars, executablePath, etc.
                },
            },
        },
    ],

    // Optionally configure global setup/teardown, or custom reporters here
});
