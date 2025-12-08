
import { _electron as electron, test, expect } from "@playwright/test";
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("electron app launches and main window loads", async () => {
    const mainPath = path.join(__dirname, "electron", "main.js");

    const electronApp = await electron.launch({ args: [mainPath] });

    const window = await electronApp.firstWindow();

    // Run code in main process
    const version = await electronApp.evaluate(({ app }) => app.getVersion());
    console.log("Electron app version:", version);

    // Run code in renderer process
    const pageTitle = await window.evaluate(() => document.title = "test");
    expect(pageTitle).toBe("test");

    const content = await window.locator("body").textContent();
    expect(content).toBeTruthy();

    await electronApp.close();
});

