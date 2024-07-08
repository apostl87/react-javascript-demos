
export default function formatNumeric(value, precision) {
    let formatInfo = '';

    let regex = /^([0-9]+)(\.)([0-9]*)$/;

    if (!regex.test(value)) {
        let nDots = (value.match(/\./g) || []).length;

        if (value.match(/[^\d\.]/g) || nDots > 1) {
            formatInfo = "Format: " + String(Number(0).toFixed(precision));
        }

        value = value.replace(/[^\d\.]/g, '');

        let idx = value.indexOf('.');
        if (idx == 0) {
            value = '0' + value;
        }
        if (nDots > 1) {
            value = value.slice(0, idx) + "." + value.slice(idx).replaceAll('.', '')
        }
    }

    let idx = value.indexOf('.');

    if (idx != -1 && value.slice(idx + 1).length > precision) {
        // value = String(Number(value).toFixed(precision)) // this rounds up or down
        value = value.slice(0, idx + precision + 1); // this truncates the value
        formatInfo = "Format: " + String(Number(0).toFixed(precision));
    }
    return { value: value, formatInfo: formatInfo }
}