const moment = require('moment');

function openAndReadFile(filters) {
    return window.ipcRenderer.sendSync('open-and-read-file', {
        filters: filters ?? [{
            name: '全部檔案',
            extensions: ['*']
        }]
    });
}

function showSaveFileDialog() {
    return window.ipcRenderer.sendSync('show-save-file-dialog');
}

function writeTextToFile(file, text) {
    window.ipcRenderer.sendSync('write-text-to-file', {
        file: file,
        text: text
    });
}

function importDataFromFile() {
    const openAndReadFileResult = openAndReadFile();
    if (
        !openAndReadFileResult.error &&
        !openAndReadFileResult.cancel &&
        openAndReadFileResult.data
    ) {
        try {
            const obj = JSON.parse(new TextDecoder().decode(openAndReadFileResult.data));
            return obj == null || obj.data == null || obj.data.guests == null || obj.data.anniversary == null || obj.data.prizeCount == null || obj.data.excludedGuests == null || obj.data.winners == null ? null : obj;
        } catch (ignored) {
            return null;
        }
    }
}

function showSaveFileDialogAndExportData(data) {
    const showSaveFileDialogResult = showSaveFileDialog();
    if (
        !showSaveFileDialogResult.error &&
        !showSaveFileDialogResult.cancel &&
        showSaveFileDialogResult.data
    ) {
        console.log(showSaveFileDialogResult.data)
        exportDataToFile(showSaveFileDialogResult.data, data);
    }
}

function exportDataToFile(file, data) {
    const jsonStr = JSON.stringify({
        data: data
    });
    writeTextToFile(file, jsonStr);
}

function autoSaveDataToFile(data) {
    exportDataToFile(`autosave_${moment().format('YYYYMMDDHHmmss')}.json`, data);
}

function exitApp() {
    window.ipcRenderer.send('exit-app');
}

export {
    openAndReadFile,
    importDataFromFile,
    showSaveFileDialog,
    showSaveFileDialogAndExportData,
    autoSaveDataToFile,
    writeTextToFile,
    exportDataToFile,
    exitApp
};