
import { isSerializable } from "../../../dist/helpers/index.js";
global.isSerializable = isSerializable;
import { app, BrowserWindow, crashReporter } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { ipcM } from "../../../dist/main/index.js";
// @ts-ignore
global.ipcM = ipcM;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom crash dump path
app.setPath("crashDumps", path.join(__dirname, "crashes"));

// Enable crash reporter early, before app.whenReady
crashReporter.start({
    productName: "YourAppName",      // Your app"s name
    companyName: "YourCompanyName",  // Your company or developer name
    submitURL: "",                   // Leave empty to disable uploading
    uploadToServer: false,           // Disable uploading, just save locally
    compress: false,                  // Compress crash reports before saving/uploading
});

function createWindow() {

    const preloadScriptPath = path.join(__dirname, "preload.bundle.js");

    const win = new BrowserWindow({
        width: 400,
        height: 300,
        show: true,
        webPreferences: {
            preload: preloadScriptPath,
            sandbox: true,
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    const webContents = win.webContents;

    global.webContents = webContents;

    const indexHtmlPath = path.join(__dirname, "index.html");

    win.loadFile(indexHtmlPath);

};

app.whenReady().then(createWindow);
