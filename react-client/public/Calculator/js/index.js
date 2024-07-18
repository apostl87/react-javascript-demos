const display = document.getElementById('display');
const result = document.getElementById('result');
const keys = document.querySelectorAll('.keys div');
const registerFlag = document.getElementById('result-register');
const manual = document.getElementById('manual');
let register = null;
let lastResult = 0;

// Event listeners for specific buttons and invoked functions
document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
    result.value = '';
    register = null;
});

document.querySelector('#keys .btn-calc').addEventListener('click', () => {
    doCalculation();
});

function doCalculation() {
    try {
        let input = parseInput(display.value);
        result.value = math.evaluate(input);
        lastResult = result.value;
        if (result.value == 'undefined') {
            result.value = '';
            lastResult = 0;
        }
    } catch (error) {
        console.log(error);
        result.value = 'Syntax Error';
    }
    display.setSelectionRange(0, display.value.length);
}

function parseInput(expr) {
    // Replace ansString
    regex = new RegExp(ansString, 'g');
    expr = expr.replace(regex, lastResult);
    // Replace ** operator by ^
    expr = expr.replace(/\*\*/g, '^');
    return expr
}

// Callback functions and invoked functions
function insertAtCaret(input) {
    // Prevent all characters except for numbers, math operators and common parentheses
    if (display.value.length < settings.maxlengthinput) {
        let sav = display.selectionStart;
        if (sav < display.selectionEnd) {
            deleteSelection();
        }
        display.value = display.value.slice(0, display.selectionStart) + input + display.value.slice(display.selectionStart);
        // Add automatical insertion of ansString if an operator is the only character contained in the display
        if (settings.binaryMathOperators.includes(display.value)) {
            display.value = ansString + display.value;
            sav += ansString.length
        }
        display.setSelectionRange(sav + input.length, sav + input.length);
    }
}

function insertAtPosition(input, position) {
    // Prevent all characters except for numbers, math operators and common parentheses
    if (display.value.length < settings.maxlengthinput) {
        display.value = display.value.slice(0, position) + input + display.value.slice(position);
    }
}

function insertAns() {
    insertAtCaret(ansString);
}

function deleteSelectionOrAtCaret() {
    if (display.selectionStart < display.selectionEnd) {
        deleteSelection();
    } else {
        deleteAtCaretPosition(offset = 0);
    }
}

function deleteSelection() {
    const sav = display.selectionStart
    display.value = display.value.slice(0, sav) + display.value.slice(display.selectionEnd);
    display.setSelectionRange(sav, sav);
    // Keep input display consistent in terms of allowed string
    deleteUnallowedStrings();
}

function deleteAtCaretPosition(offset = 0) {
    if (display.selectionStart == display.value.length) {
        display.value = display.value.slice(0, display.value.length - 1);
    } else {
        display.value = display.value.slice(0, display.selectionStart + offset) + display.value.slice(display.selectionStart + offset + 1);
    }
    // Keep input display consistent in terms of allowed string
    deleteUnallowedStrings();
}

function deleteAtPosition(position) {
    display.value = display.value.slice(0, position) + display.value.slice(position + 1);
    // Keep input display consistent in terms of allowed string
    deleteUnallowedStrings();
}

function deleteUnallowedStrings() {
    regex = /[a-zA-Z]+/g;
    const matches = [...display.value.matchAll(regex)];
    matches.forEach((m) => {
        if (!settings.allowedStrings.includes(m[0])) {
            let sav = display.selectionStart;
            if (display.selectionStart > m.index) {
                sav -= m[0].length;
            }
            display.value = display.value.slice(0, m.index) + display.value.slice(m.index + m[0].length);
            display.setSelectionRange(sav, sav);
        }
    })
}

function plusOrMinus() {
    let caretOrSelection = [display.selectionStart, display.selectionEnd];
    let start, end
    [start, end] = findNumber();
    if (display.value[start - 1] != '-') {
        if (display.value[start - 1] == '+') {
            deleteAtPosition(position = start - 1);
            start -= 1;
            caretOrSelection[0] -= 1;
            caretOrSelection[1] -= 1;
        }
        insertAtPosition('-', start);
        caretOrSelection[0] += 1;
        caretOrSelection[1] += 1;
    } else {
        deleteAtPosition(position = start - 1)
        insertAtPosition('+', start - 1);
    }
    display.setSelectionRange(caretOrSelection[0], caretOrSelection[1]);
}

function findNumber() {
    const currentValue = display.value;
    let start = display.selectionStart;
    let end = display.selectionEnd;
    // Move start index to the beginning of the number
    while (start > 0 && /[\d\.]/.test(currentValue[start - 1])) {
        start--;
    }
    // Move end index to the end of the number
    while (end < currentValue.length && /\d/.test(currentValue[end])) {
        end++;
    }
    return [start, end];
}

function storeInRegister() {
    if (!isNaN(+result.value) && result.value !== '') {
        register = result.value;
    }
}

function recallFromRegister() {
    if (register) {
        insertAtCaret(register);
    }
}

function updateRegisterFlag() {
    if (register) {
        registerFlag.innerHTML = 'M';
    } else {
        registerFlag.innerHTML = '';
    }

}

// General event listeners
display.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        doCalculation();
    }
});


display.addEventListener("keydown", function (event) {
    if (!settings.allowedSpecialKeys.includes(event.key)) {
        event.preventDefault();
        if (settings.allowedCharacters.includes(event.key)) {
            insertAtCaret(event.key);
        }
    }
});


// Print manual
function getManualTableContainer() {
    let result = ``
    for (const [key, value] of Object.entries(manualItems)) {
        result += `<tr><td class='manual manual-key'>${key}</td><td class='manual manual-value'>${value}</td></tr>`
    }
    return result;
}
manual.innerHTML = `
<div class="manual">
    <table class="manual manual-table" align="center">
        ${getManualTableContainer()}
    </table>
</div>`

// General program behavior
function keepSanity() {
    // Keep input display element in focus; Ensures that input is always processed and that caret is displayed
    display.focus();
    // Keep input display element free from not allowed characters
    let regex = new RegExp('[^' + settings.allowedCharacters + settings.allowedStrings.join('') + ']', 'g')
    display.value = display.value.replace(regex, '');
    // Keep input display element size according to the setting
    display.value = display.value.slice(0, settings.maxlengthinput);
    // Keep the register tag up to date
    updateRegisterFlag()
}
setInterval(() => keepSanity(), 250);