function openAndReadFile(filters) {
    return window.ipcRenderer.sendSync('open-and-read-file', {
        filters: filters ?? [{ name: '全部檔案', extensions: ['*'] }]
    });
}

export {
    openAndReadFile
};