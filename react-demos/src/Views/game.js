const htmlfile = `
<script>
    let KEY_SPACE = false;
    let KEY_UP = false;
    let KEY_DOWN = false;
    let KEY_LEFT = false;
    let KEY_RIGHT = false;
    let drawmode = 'run';
    let canvas;
    let ctx;
    let bgImage = new Image();
    let rocket;
    let score = 0;
    let missed = 0;

    let ufos = [];
    let shots = [];

    let RestartButtonRect = {
        x: 225,
        y: 225,
        width: 150,
        height: 50,
    };

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'KeyW'].includes(e.code))
            KEY_UP = true;
        if (['ArrowDown', 'KeyS'].includes(e.code))
            KEY_DOWN = true;
        if (['ArrowLeft', 'KeyA'].includes(e.code))
            KEY_LEFT = true;
        if (['ArrowRight', 'KeyD'].includes(e.code))
            KEY_RIGHT = true;
        if (['Space'].includes(e.code))
            KEY_SPACE = true;
    });

    document.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'KeyW'].includes(e.code))
            KEY_UP = false;
        if (['ArrowDown', 'KeyS'].includes(e.code))
            KEY_DOWN = false;
        if (['ArrowLeft', 'KeyA'].includes(e.code))
            KEY_LEFT = false;
        if (['ArrowRight', 'KeyD'].includes(e.code))
            KEY_RIGHT = false;
        if (['Space'].includes(e.code))
            KEY_SPACE = false;
    });

    function initRocket() {
        rocket = {
            x: 50,
            y: canvas.height / 2 - 20,
            width: 100,
            height: 40,
            src: 'img/rocket.png'
        };
    }

    function loadImages() {
        bgImage.src = 'img/space.jpg';
        rocket.img = new Image();
        rocket.img.src = rocket.src;
    }

    function draw() {
        ctx.drawImage(bgImage, 0, 0);
        ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

        ufos.forEach(function (ufo) {
            ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
        });

        shots.forEach(function (shot) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(shot.x, shot.y,
                shot.width, shot.height);
        });

        if (drawmode == 'stop') {
            drawMenu();
        }

        requestAnimationFrame(draw);
    }

    function drawMenu() {
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.rect(canvas.width / 2 - 100, canvas.height / 2 - 30, 200, 125);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
        ctx.font = "24px Arial";
        ctx.fillStyle = '#000000';
        ctx.fillText("Game over", canvas.width / 2, canvas.height / 2);
        drawRestartButton(RestartButtonRect);
    }

    function drawScoreboard() {
        ctxSb.fillStyle = '#ffffff';
        ctxSb.fillRect(0, 0, scoreboard.width, scoreboard.height);
        ctxSb.font = "16px Arial";
        ctxSb.fillStyle = '#000000';
        ctxSb.textAlign = 'center';
        let str = "Score: " + String(score) + "      Missed: " + String(missed)
        ctxSb.fillText(str, scoreboard.width / 2, scoreboard.height / 2);

        requestAnimationFrame(drawScoreboard);
    }

    function getMousePos(canvas, event) {
        let RestartButtonRect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - RestartButtonRect.left,
            y: event.clientY - RestartButtonRect.top,
        };
    }

    function isInside(pos, RestartButtonRect) {
        return pos.x > RestartButtonRect.x && pos.x < RestartButtonRect.x + RestartButtonRect.width && pos.y < RestartButtonRect.y + RestartButtonRect.height && pos.y > RestartButtonRect.y
    }

    // Function for binding the click event on the canvas
    function addRestartListener() {
        canvas.addEventListener('click', clickRestartButton);
    }

    function clickRestartButton(evt) {
        var mousePos = getMousePos(canvas, evt);
        if (isInside(mousePos, RestartButtonRect)) {
            canvas.removeEventListener('click', clickRestartButton)
            restartGame();
        }
    }

    // Question code
    function drawRestartButton(RestartButtonRect, lWidth, fillColor, lineColor) {
        ctx.beginPath();
        ctx.rect(RestartButtonRect.x, RestartButtonRect.y, RestartButtonRect.width, RestartButtonRect.height);
        ctx.fillStyle = 'rgba(80,166,80,1)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
        ctx.font = '16pt Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 50);
    }

    function moveLeft(ufo) {
        if (!ufo.hit) {
            ufo.x -= 3;
        }
        if (ufo.x < - ufo.width) {
            idx = ufos.indexOf(ufo);
            ufos.splice(idx, 1);
            missed += 1;
        }
    }

    function moveRight(shot) {
        shot.x += 15
        if (shot.x > canvas.width) {
            idx = shots.indexOf(shot);
            shots.splice(idx, 1);
        }
    }

    function update() {
        if (KEY_UP) {
            if (rocket.y >= 0)
                rocket.y -= 5
        }
        if (KEY_DOWN) {
            if (rocket.y + rocket.height <= canvas.height)
                rocket.y += 5
        }
        if (KEY_LEFT)
            if (rocket.x >= 0) rocket.x -= 5;
        if (KEY_RIGHT)
            if (rocket.x + rocket.width <= canvas.width) rocket.x += 5;

        ufos.forEach(moveLeft)
        shots.forEach(moveRight)
    }

    function createUfo() {
        let h = 50
        let ufo = {
            x: 600,
            y: Math.floor(Math.random() * (canvas.height - h)),
            width: 80,
            height: h,
            src: 'img/ufo.png',
            img: new Image()
        };
        ufo.img.src = ufo.src;
        ufos.push(ufo)
    }

    function checkForCollision() {

        // Collision UFO-Rocket
        ufos.forEach(function (ufo) {
            if (!ufo.hit &&
                rocket.x + rocket.width > ufo.x &&
                rocket.y + rocket.height > ufo.y &&
                rocket.x < ufo.x + ufo.width &&
                rocket.y < ufo.y + ufo.height

            ) {
                rocket.img.src = 'img/explosion.png';
                console.log('Collision!!!');
                ufos = ufos.filter(u => u != ufo);
                stopGame();
            }
        });

        // Collision UFO-Laser
        ufos.forEach(function (ufo) {
            shots.forEach(function (shot) {
                if (!ufo.hit &&
                    shot.x + shot.width > ufo.x &&
                    shot.y + shot.height > ufo.y &&
                    shot.x < ufo.x + ufo.width &&
                    shot.y < ufo.y + ufo.height
                ) {
                    ufo.hit = true;
                    score += 1;
                    ufo.img.src = 'img/explosion.png';
                    console.log('Ufo destroyed!!!');
                    setTimeout(() => {
                        ufos = ufos.filter(u => u != ufo);
                    }, 1000);
                    shots = shots.filter(s => s != shot)
                }
            });
        });
    }

    function shoot() {
        if (KEY_SPACE) {
            shots.push({
                y: rocket.y + rocket.height / 2,
                x: rocket.x + rocket.width,
                width: 20,
                height: 3
            });
        };
    }

    function stopGame() {
        drawmode = 'stop';
        clearInterval(loop1);
        clearInterval(loop2);
        clearInterval(loop3);
        clearInterval(loop4);
        addRestartListener();
    }

    function startGame() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        initRocket();
        loadImages();
        loop1 = setInterval(update, 1000 / 30);
        loop2 = setInterval(createUfo, 1000);
        loop3 = setInterval(checkForCollision, 1000 / 30);
        loop4 = setInterval(shoot, 1000 / 10);
        draw();

        scoreboard = document.getElementById('scoreboard');
        ctxSb = scoreboard.getContext('2d');
        drawScoreboard();
    }

    function restartGame() {
        drawmode = 'run';
        score = 0;
        missed = 0;
        ufos = [];
        shots = [];
        startGame();
    }
</script>


<canvas id="canvas" width="600" height="400"></canvas>
<canvas id="scoreboard" width="600" height="30"></canvas>
`;

module.exports = htmlfile;