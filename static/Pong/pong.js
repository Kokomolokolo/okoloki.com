const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

canvas.width = 750
canvas.height = 500

let pointsPlayer = 0
let pointsBot = 0

const paddlePlayer = {
    x: 100,
    y: 20,
    width:10,
    height:100,
    speed: 5,
}

const paddleBot = {
    x: canvas.width - 100,
    y: 20,
    width:10,
    height:100,
    speed: 3.5,
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width:5,
    height:5,
    dx: 1.41,
    dy: 1.41,
    radius: 10,
}

let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);


let gameloop = () => {
    draw()
    update()
    requestAnimationFrame(gameloop)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isPaused = false

let update = async () => {
    ballMov()
    
    if (ball.y + ball.radius > canvas.height || ball.y < 0 + ball.radius ) {
        ball.dy = -ball.dy
    }

    if ( // Collision
        ball.x + ball.radius >= paddleBot.x &&
        ball.x - ball.radius <= paddleBot.x + paddleBot.width &&
        ball.y + ball.radius >= paddleBot.y &&
        ball.y - ball.radius <= paddleBot.y + paddleBot.height
    ) {
        deflectAngleMitSatzDesPythagoras(paddleBot)
    }
    
    if (
        ball.x + ball.radius >= paddlePlayer.x &&
        ball.x - ball.radius <= paddlePlayer.x + paddlePlayer.width &&
        ball.y + ball.radius >= paddlePlayer.y &&
        ball.y - ball.radius <= paddlePlayer.y + paddlePlayer.height
    ) {
        deflectAngleMitSatzDesPythagoras(paddlePlayer)
    }

    // player movement
    if (keys["ArrowUp"] && paddlePlayer.y >= 0) {
        paddlePlayer.y -= paddlePlayer.speed
    }

    if (keys["ArrowDown"] && paddlePlayer.y < canvas.height - paddlePlayer.height) {
        paddlePlayer.y += paddlePlayer.speed
    }


    //Bot AI
    let targetY = ball.y - paddleBot.height / 2;
    
    if (paddleBot.y < targetY) {
        paddleBot.y += paddleBot.speed;
    
    }
    else if (paddleBot.y > targetY) {
        paddleBot.y -= paddleBot.speed;
    }

    // check for point
    if (ball.x < 0 ) {
        pointsBot += 1
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        isPaused = true; // Pause the game
        await sleep(3000); // Wait for 3 seconds
        isPaused = false; // Resume the game
        ball.dy = (Math.random() * 9) - 4;
        setSpeed(2)
    }
    if (ball.x > canvas.width) {
        pointsPlayer += 1
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        // ball.dx = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()); // Random speed between 0.5 and 1.5
        isPaused = true; // Pause the game
        await sleep(3000); // Wait for 3 seconds
        isPaused = false; // Resume the game
        ball.dy = (Math.random() * 9) - 4;
        setSpeed(2)
    }
}

function ballMov(){
    if (isPaused){
        return;
    }
    ball.x = ball.x + ball.dx
    ball.y = ball.y + ball.dy
}

function setSpeed(targetSpeed){
    let speed = Math.sqrt(ball.dy ** 2 + ball.dx ** 2);
    targetSpeed = 2;

    ball.dx *= targetSpeed / speed;
    ball.dy *= targetSpeed / speed;
}


let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Player
    ctx.fillStyle= "white"
    ctx.fillRect(paddlePlayer.x, paddlePlayer.y, paddlePlayer.width, paddlePlayer.height)

    ctx.fillStyle = "white"
    ctx.fillRect(paddleBot.x, paddleBot.y, paddleBot.width, paddleBot.height)

    ctx.beginPath();
    // ctx.fillRect(ball.x, ball.y, ball.height, ball.width);
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath();

    //Points
    ctx.font = "50px Arial"
    ctx.fillText(`${pointsPlayer} zu ${pointsBot}`, canvas.width / 2 - 75, 90)


}

let targetSpeed = 5

let deflectAngleMitSatzDesPythagoras = (paddle) => {
    let paddleCenter = paddle.y + paddle.height / 2;
    let hitPosition = ball.y - paddleCenter;
    let normalizedHitPosition = hitPosition / (paddle.height / 2);
    let maxDeflection = 3;

    // Anpassung des Winkels (dy basierend auf Treffpunkt)
    ball.dy = normalizedHitPosition * maxDeflection;

    // Rundung von dy auf zwei Nachkommastellen
    ball.dy = parseFloat(ball.dy.toFixed(2));

    // Geschwindigkeit konstant halten (z.B. 2)
    let speed = Math.sqrt(ball.dy ** 2 + ball.dx ** 2);
    let targetSpeed = 5;

    ball.dx *= targetSpeed / speed;
    ball.dy *= targetSpeed / speed;

    // Richtung umkehren
    ball.dx *= -1;
    
    
    
    
    // let paddleCenter = paddle.y + paddle.height / 2;
    // let hitPosition = ball.y - paddleCenter;
    // let normalizedHitPosition = hitPosition / (paddle.height / 2);
    // let maxDeflection = 3;
    
    // ball.dy = normalizedHitPosition * maxDeflection;
    // ball.dy = Number.prototype.toFixed(2)
    
    // let speed = 0
    // for (speed = 0; speed != 2; speed = Math.sqrt(ball.dy ** 2 + ball.dx ** 2)){
    //     if (speed > 2){
    //         ball.dx += 0.01
    //     }
    //     else {
    //         ball.dx -= 0.01
    //     }
    // }
    // console.log(ball.dx)
    // ball.dx *= -1;
};
gameloop()

const usericon = document.querySelector(".usericon")
const dropdown = document.querySelector(".dropdown")

usericon.addEventListener('click', () => {
    dropdown.style.display = "block";
    dropdown.style.color = "black";
    dropdown.style.padding = "10px";
});
document.addEventListener("click", (event) => {
    // Check if the click is outside the usericon and dropdown
    if (!usericon.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = "none";
    }
});
