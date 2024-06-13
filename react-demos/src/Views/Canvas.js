// import React, { useRef, useEffect } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   useEffect(() => {
//     let canvas = canvasRef.current
//     let ctx = canvas.getContext('2d')
//     //Our first draw
//     // context.fillStyle = '#000000'
//     // context.fillRect(0, 0, context.canvas.width, context.canvas.height)

//     let KEY_SPACE = false;
//     let KEY_UP = false;
//     let KEY_DOWN = false;
//     let KEY_LEFT = false;
//     let KEY_RIGHT = false;
//     let drawmode = 'run';
//     // let canvas;
//     // let ctx;
//     let bgImage = new Image();
//     let rocket;
//     let score = 0;
//     let missed = 0;

//     let ufos = [];
//     let shots = [];

//     let RestartButtonRect = {
//         x: 225,
//         y: 225,
//         width: 150,
//         height: 50,
//     };

//     document.addEventListener('keydown', (e) => {
//         if (['ArrowUp', 'KeyW'].includes(e.code))
//             KEY_UP = true;
//         if (['ArrowDown', 'KeyS'].includes(e.code))
//             KEY_DOWN = true;
//         if (['ArrowLeft', 'KeyA'].includes(e.code))
//             KEY_LEFT = true;
//         if (['ArrowRight', 'KeyD'].includes(e.code))
//             KEY_RIGHT = true;
//         if (['Space'].includes(e.code))
//             KEY_SPACE = true;
//     });

//     document.addEventListener('keyup', (e) => {
//         if (['ArrowUp', 'KeyW'].includes(e.code))
//             KEY_UP = false;
//         if (['ArrowDown', 'KeyS'].includes(e.code))
//             KEY_DOWN = false;
//         if (['ArrowLeft', 'KeyA'].includes(e.code))
//             KEY_LEFT = false;
//         if (['ArrowRight', 'KeyD'].includes(e.code))
//             KEY_RIGHT = false;
//         if (['Space'].includes(e.code))
//             KEY_SPACE = false;
//     });

   

//   }, [])
  
  
//   return (<body onLoad={startGame()}>
//   <canvas ref={canvasRef} {...props}/>
//   </body>
//   )
// }

// export default Canvas