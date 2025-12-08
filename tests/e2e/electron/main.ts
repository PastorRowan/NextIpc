
import { app, BrowserWindow } from "electron";

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        show: false,
        webPreferences: {
            sandbox: true,
            nodeIntegration: false,
            contextIsolation: false,
        }
    });

    win.loadURL("data:text/html,<h1>Hello from Electron!</h1>");
};

app.whenReady().then(createWindow);
