import XLSX from 'xlsx';

function parseGuestList(data) {
    const workbook = XLSX.read(data, {
        type: 'array'
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const converted = XLSX.utils.sheet_to_json(worksheet);
    const mapped = converted.map(r => {
        return {
            rowNum: r.__rowNum__,
            dept: r['部門'],
            nameEn: r['英文姓名'],
            staffNo: r['員工編號'],
            nameZh: r['中文姓名']
        };
    })
    return mapped;
}

export {
    parseGuestList
}