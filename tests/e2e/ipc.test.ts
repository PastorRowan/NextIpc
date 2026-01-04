
import { _electron as electron, ElectronApplication, Page } from "playwright";
import { test, expect } from "playwright/test";
import path from "path";
import { fileURLToPath } from "url";

// ESM __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let electronApp: ElectronApplication;
let page: Page;

// Resolve electron/main.js relative to this file
const electronMainPath = path.resolve(__dirname, "electron/main.js");

test.beforeAll(async function() {

    // Intialise main process
    electronApp = await electron.launch({ args: [electronMainPath] });

    // Main process logging
    electronApp.on("console", function(msg) {
        const type = msg.type().toUpperCase();
        console.log(`[MAIN:${type}]`, msg.text());
    });

    electronApp.on("close", function() {
        console.log("[MAIN] Electron app closed");
    });

    // Renderer logging (all windows)
    electronApp.on("window", function(pageArg) {
        pageArg.on("console", (msg) => {
            const type = msg.type().toUpperCase();
            console.log(`[RENDERER:${type}]`, msg.text());
        });

        pageArg.on("pageerror", function(error) {
            console.log("[RENDERER:PAGEERROR]", error);
        });

        pageArg.on("crash", () => {
            console.log("[RENDERER:CRASH] Renderer process crashed");
        });
    });

    // Intialise renderer process
    page = await electronApp.firstWindow();

    // Validate main globals
    await electronApp.evaluate(function() {
        const createMainClient = global.createMainClient;
        if (typeof createMainClient !== "function") {
            throw new Error("createMainClient was not assigned to the global object in main process");
        };
        const createMainListeners = global.createMainListeners;
        if (typeof createMainListeners !== "function") {
            throw new Error("createMainListeners was not assigned to the global object in main process");
        };
    });

    // Validate renderer globals
    await page.evaluate(function() {
        const createRendererClient = window.ipcR.createRendererClient;
        if (typeof createRendererClient !== "function") {
            throw new Error(
                "createRendererClient was not assigned to the window object in renderer process\n"
                + "Run exposeInMainWorld function in preload script\n"
                + "More info in the preload folder"
            );
        };
        const createRendererListeners = window.ipcR.createRendererListeners;
        if (typeof createRendererListeners !== "function") {
            throw new Error(
                "createRendererListeners was not assigned to the window object in renderer process\n"
                + "Run exposeInMainWorld function in preload script\n"
                + "More info in the preload folder"
            );
        };
    });

});

// Closes electron after all tests
test.afterAll(async function() {
    await electronApp.close();
});

test.describe("IPC end-to-end", () => {

    test("Renderer.invoke -> Main.handle", async function() {

        const mockPayload = { id: "123" };

        // Register main listeners
        await electronApp.evaluate(async function() {

            const createMainListeners = global.createMainListeners;

            const testDomain = global.testDomain;

            console.log("testDomain: ", testDomain);

            const testListeners = createMainListeners(testDomain);

            testListeners.handle("get", function(_, arg) {
                console.log("test:get is running");
                console.log("arg: ", arg);
                return arg;
            });

        });

        // Register renderer client
        const user = await page.evaluate(async function(mockData) {

            const testDomain = window.testDomain;
            const { createRendererClient } = window.ipcR;

            const testClient = createRendererClient(testDomain);

            return await testClient.invoke("get", mockData);

        }, mockPayload);

        expect(user).toEqual(mockPayload);

    });

    test("Renderer.send -> Main.on", async function() {

        const mockPayload = { id: "123" };

        // Setup ipcMain.on listener to capture sent payload
        await electronApp.evaluate(function() {

            const testDomain = global.testDomain;

            const createMainListeners = global.createMainListeners;

            const testListeners = createMainListeners(testDomain);

            testListeners.on("update", function(_, arg) {
                global.payload = arg;
            });

        });

        // Renderer sends "settings:update" message
        await page.evaluate(function(mockData) {

            const testDomain = window.testDomain;
            const { createRendererClient } = window.ipcR;

            const testClient = createRendererClient(testDomain);

            testClient.send("update", mockData);

        }, mockPayload);

        // Poll main process global to verify the payload was received correctly
        const receivedPayload = await electronApp.evaluate(function() {
            return new Promise((resolve, reject) => {
                // 5 seconds timeout
                const maxWaitTime = 5000;
                // poll every 200ms
                const intervalTime = 200;
                let elapsed = 0;

                const interval = setInterval(function() {
                    const payload = global.payload;
                    if (payload) {
                        clearInterval(interval);
                        resolve(payload);
                    } else {
                        elapsed += intervalTime;
                        if (elapsed >= maxWaitTime) {
                            clearInterval(interval);
                            reject(new Error("Timeout: global.payload did not become truthy within 5 seconds"));
                        };
                    };
                }, intervalTime);
            });
        });

        expect(receivedPayload).toEqual(mockPayload);

    });

    test("webContents.send -> ipcRenderer.on (= ipcMain.send -> ipcRenderer.on)", async function() {

        // Setup ipcRenderer.on listener in renderer to receive main -> renderer messages
        await page.evaluate(function() {

            const testDomain = window.testDomain;
            const { createRendererListeners } = window.ipcR;

            const testListeners = createRendererListeners(testDomain);

            testListeners.on("notify", function(_, arg) {
                window.payload = arg;
            });

        });

        const mockPayload = { id: "123" };

        // From main process, send event to renderer
        await electronApp.evaluate(function(_, mockData) {

            const isSerializable = global.isSerializable;

            if (typeof isSerializable !== "function") {
                throw new Error(
                    "ERROR: The global 'isSerializable' function is missing or not defined in the main process.\n" +
                    "Make sure 'isSerializable' is correctly attached to the global object before sending IPC messages."
                );
            };

            if (!isSerializable(mockData)) {

                let payloadString: string;
                try {
                    payloadString = JSON.stringify(mockData, null, 2);
                } catch {
                    payloadString = String(mockData);
                };

                throw new Error(
                    "ERROR: The provided mockPayload is not serializable.\n" +
                    "IPC messages must use serializable data structures (e.g., no functions, DOM nodes, or complex classes).\n\n" +
                    "Payload value: " + payloadString + "\n\n"
                );

            };

            const webContents = global.webContents;
            const testDomain = global.testDomain;

            const createMainClient = global.createMainClient;

            const testClient = createMainClient(testDomain);

            testClient.send(webContents, "notify", mockData);

        }, mockPayload);

        const receivedPayload = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                // 5 seconds timeout
                const maxWaitTime = 5000;
                // poll every 200ms
                const intervalTime = 200;
                let elapsed = 0;

                const interval = setInterval(() => {
                    const payload = window.payload;
                    if (payload) {
                        clearInterval(interval);
                        resolve(payload);
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
