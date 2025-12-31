
import { isSerializable } from "../../../dist/helpers/index.js";
global.isSerializable = isSerializable;
import {
    app,
    BrowserWindow
} from "electron";
import path from "path";
import { fileURLToPath } from "url";
import {
    createMainClient,
    createMainListeners
} from "../../../dist/main/index.js";
import { testDomain } from "../test.domain.js";

global.createMainClient = createMainClient;
global.createMainListeners = createMainListeners;
global.testDomain = testDomain;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
