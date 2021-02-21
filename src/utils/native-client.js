function openAndReadFile() {
    return window.ipcRenderer.sendSync('open-and-read-file');
}

export {
    openAndReadFile
};