import { app, BrowserWindow, Menu } from 'electron';
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    Menu.setApplicationMenu(null);

    if (process.env.NODE_ENV === 'development') {
        
    }
}