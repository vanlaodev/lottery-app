const {
    ipcMain,
    dialog,
    app
} = require('electron')

const fs = require('fs')

ipcMain.on('exit-app', () => {
    app.quit()
});

ipcMain.on('show-save-file-dialog', (event) => {
    try {
        const file = dialog.showSaveDialogSync();
        if (!file) {
            event.returnValue = {
                cancel: true
            };
        } else {
            event.returnValue = {
                data: file
            };
        }
    } catch (err) {
        event.returnValue = {
            error: err
        }
    }
});

ipcMain.on('write-text-to-file', (event, arg) => {
    try {
        fs.writeFile(arg.file, arg.text, null, err => {
            if (err) {
                event.returnValue = {
                    error: err
                };
            } else {
                event.returnValue = {
                    success: true
                };
            }
        });
    } catch (err) {
        event.returnValue = {
            error: err
        };
    }
});

ipcMain.on('open-and-read-file', (event, arg) => {
    try {
        const file = dialog.showOpenDialogSync({
            properties: ['openFile'],
            filters: arg && arg.filters ? arg.filters : [{
                name: '全部檔案',
                extensions: ['*']
            }]
        });
        if (!file) {
            event.returnValue = {
                cancel: true
            };
        } else {
            fs.readFile(file[0], null, (err, data) => {
                if (err) {
                    event.returnValue = {
                        error: err
                    }
                    return
                }
                event.returnValue = {
                    data: data
                }
            });
        }
    } catch (err) {
        event.returnValue = {
            error: err
        }
    }
})