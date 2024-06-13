import React, { useState, useEffect } from 'react';
const htmlfile = require('./game.js')
console.log(htmlfile)
//var parse = require('html-react-parser');

const SpaceGame = () => {
    const [htmlContent, setHtmlContent] = useState('');

    // Fetch the HTML file with an effect hook
    useEffect(() => {
        fetch('../Components/SpaceGame/SpaceGame.html')
            .then(response => response.text())
            .then(data => setHtmlContent(data));
    }, []);

    // Return
    return (
        <div>
            <h3>Minimal Arcade Space Shooter in JavaScript</h3>
            {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
            {/* <div dangerouslySetInnerHTML={template} /> */}
            <div dangerouslySetInnerHTML={{ __html: htmlfile }} />
            <iframe src='' width='620' height='500'>{htmlfile}</iframe>

            <iframe src='http://127.0.0.1:5500/react-demos/src/Components/SpaceGame/SpaceGame.html' width='620' height='500'></iframe>
        </div>
    )
}

export default SpaceGame