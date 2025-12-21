
import { _electron as electron, ElectronApplication, Page } from "playwright";
import { test, expect } from "playwright/test";
import path from "path";
import { fileURLToPath } from "url";

// ESM __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {

    // Intialise main process
    electronApp = await electron.launch({ args: ["electron/main.js"] });
    await electronApp.evaluate(function() {
        const ipcM = global.ipcM;
        if (ipcM === undefined) {
            throw new Error("ipcM is undefined please check that it is attached to global object");
        };
    });

    // Intialise renderer process
    page = await electronApp.firstWindow();
    await page.evaluate(function() {
        const ipcR = window.ipcR;
        if (ipcR === undefined) {
            throw new Error("ipcR is undefined please check that preload exposeInMainWorld function has run");
        };
    });

});

test.afterAll(async function() {
    await electronApp.close();
});

test.describe("IPC helpers end-to-end", () => {

    test("ipcRenderer.invoke -> ipcMain.handle", async function() {

        const mockData = { id: "123", name: "Alice" };

        // Register ipcMain.handle("user:get")
        await electronApp.evaluate(function() {

            const ipcM = global.ipcM;

            ipcM.handle("user:get", function(_, arg) {
                return arg;
            });

        });

        // Renderer invokes "user:get"
        const user = await page.evaluate((mockData) => {

            const ipcR = window.ipcR;

            ipcR.invoke("user:get", mockData);

        }, mockData);

        expect(user).toEqual(mockData);

    });

    test("ipcRenderer.send -> ipcMain.on", async function() {

        const mockPayload = { id: "123", name: "Alice" };

        // Setup ipcMain.on listener to capture sent payload
        await electronApp.evaluate(function() {

            const ipcM = global.ipcM;

            ipcM.on("user:set", function(_, payload) {
                global.payload = payload;
            });

        });

        // Renderer sends "settings:update" message
        await page.evaluate(function(mockPayload) {

            const ipcR = window.ipcR;

            ipcR.send("user:set", mockPayload);

        }, mockPayload);

        // Poll main process global to verify the payload was received correctly
        const receivedPayload = await electronApp.evaluate(function() {
            return global.payload;
        });

        expect(receivedPayload).toEqual(mockPayload);

    });

    test("webContents.send -> ipcRenderer.on (= ipcMain.send -> ipcRenderer.on)", async function() {

        // Setup ipcRenderer.on listener in renderer to receive main -> renderer messages
        await page.evaluate(function() {

            const ipcR = window.ipcR;

            ipcR.on("user:updated", (_, payload) => {
                window.payload = payload;
            });

        });

        const mockPayload = { id: "123", name: "Alice Updated" };

        // From main process, send event to renderer
        await electronApp.evaluate(function(mockPayloadP) {

            const isSerializable = global.isSerializable;

            if (!isSerializable(mockPayloadP)) {
                throw new Error("payloadP is not serializable");
            };

            const webContents = global.webContents;
            const ipcM = global.ipcM;

            ipcM.send(webContents, "user:updated", mockPayloadP);

        }, mockPayload);

        const receivedPayload = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                // 5 seconds timeout
                const maxWaitTime = 5000;
                // poll every 200ms
                const intervalTime = 200;
                let elapsed = 0;

                const interval = setInterval(() => {
                    if (window.payload) {
                        clearInterval(interval);
                        resolve(window.payload);
                    } else {
                        elapsed += intervalTime;
                        if (elapsed >= maxWaitTime) {
                            clearInterval(interval);
                            reject(new Error("Timeout: window.payload did not become truthy within 5 seconds"));
                        };
                    };
                }, intervalTime);
            });
        });

        expect(receivedPayload).toEqual(mockPayload);

    });

});
