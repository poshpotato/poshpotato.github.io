var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var ballSpeed = 2;
var dx = ballSpeed;
var dy = -ballSpeed;
var ballRadius = 10;
const ballColor = ["#A10000", "#A25203", "#A1A100", "#FF0000", "#416600", "#078446", "#008282", "#004182", "#0021CB", "#631DB4", "#6A006A", "99004d"]
var ballColorStep = 0;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleSpeed = 4;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status : 1};
    }
}
var score = 0;
var lives = 3;
var level = 1;

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            if (bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);  
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor[ballColorStep];
    ctx.fill(); 
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth,paddleHeight)
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks()
    drawPaddle()
    drawBall()
    drawScore()
    drawLives()
    drawLevel()
    x += dx;
    y += dy;
    //collision time
    collisionDetection()
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } 
        else {
            lives--
            if(!lives){
                alert("GAME OVER.");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = ballSpeed
                dy = ballSpeed*-1
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    if(rightPressed){
        paddleX += paddleSpeed;
        if(paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if(leftPressed) {
        paddleX -= paddleSpeed;
        if(paddleX < 0){
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX-paddleWidth/2 > 0 && relativeX+paddleWidth/2 < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x+ballRadius > b.x && x-ballRadius < b.x+brickWidth && y+ballRadius > b.y && y-ballRadius < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    ballColorStep += 1;
                    score++
                    if(score == brickRowCount*brickColumnCount*level) {
                        alert("YOU WIN! CONGRATULATIONS!");
                        x = canvas.width/2;
                        y = canvas.height-30;
                        ballSpeed++
                        level++
                        dx = ballSpeed
                        dy = ballSpeed*-1
                        ballColorStep = 0
                        paddleX = (canvas.width-paddleWidth)/2;
                        for (var c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for (var r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status : 1};
                            }
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " +score, 8, 20)
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level "+level, canvas.width/2, 20);
}
