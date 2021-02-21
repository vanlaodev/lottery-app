function openAndReadFile(filters) {
    return window.ipcRenderer.sendSync('open-and-read-file', {
        filters: filters ?? [{
            name: '全部檔案',
            extensions: ['*']
        }]
    });
}

function exitApp() {
    window.ipcRenderer.send('exit-app');
}

export {
    openAndReadFile,
    exitApp
};