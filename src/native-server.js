const {
    ipcMain,
    dialog
} = require('electron')

const fs = require('fs')

ipcMain.on('open-and-read-file', (event, arg) => {
    try {
        const file = dialog.showOpenDialogSync({
            properties: ['openFile']
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