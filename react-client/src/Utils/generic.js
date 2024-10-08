function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function colorText(colorHex) {
    colorHex = colorHex.trim();
    return (colorHex != '' ? (`HEX: ${colorHex}, RGB: (${Object.values(hexToRgb(colorHex)).join(',')})`) : '');
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function cleanString(str) {
    let cleanedStr = str.replaceAll("%20", " ")
    cleanedStr = cleanedStr.replace(/[_\-!@#\$%\^\*\(\)\+=\[\]\{\};:'",.<>\/?\\|`~]/g, ' ');
    cleanedStr = cleanedStr.replace(/\s+/g, ' '); // shorten any whitespace chain to a length of one
    return cleanedStr.trim();
}

function capitalizeLetters(str) {
    return str.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Should be outsorced to another module
function pathToProduct(product) {
    return (product.mp_name.toLowerCase() + '-P' + product.mp_id);
}

module.exports = {
    hexToRgb,
    rgbToHex,
    colorText,
    validateEmail,
    capitalizeLetters,
    cleanString,
    getRandomInt,
    pathToProduct
}