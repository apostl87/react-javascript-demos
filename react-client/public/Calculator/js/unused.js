function draw() {
    const circ = document.getElementById('displaypointer');
    const position = calculatePositionsOfInlays('pointer'); // Calculate the position here
    circ.style.right = position;
}

function calculatePositionsOfInlays(which) {
    if (which == 'pointer') {
        const fontsize = window.getComputedStyle(display, null).getPropertyValue('font-size');
        let result = display.value.length - display.selectionStart
        result = result * parseFloat(fontsize)*0.595 - parseFloat(fontsize)*0.08; // font size x correction factor
        result += 'px';
        console.log(result)
        return result
    }
}