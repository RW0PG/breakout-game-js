var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

canvas.style.border = "5px solid black"

const PADDLE_HEIGHT = 10
const PADDLE_MARGIN_BOTTOM = 30
let PADDLE_WIDTH = 125

paddle = {
    pos_x: (canvas.width - PADDLE_WIDTH) / 2,
    pos_y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: 'white',
    offset: 4,
    strokeColor: "#FFFFF"
}

const BALL_RADIUS = 10
left_arrow = false
right_arrow = false
let lives = 1
let destroyed_blocks = 0
let amount_of_blocks = 0
let score = 0
let level = 1
let GAME_OVER = false
let GAME_WIN = false
let possibleMove = false
let brick_color_set = true

function difficulties() {

    let difficulty = window.prompt("Enter difficulty level: easy - 0, medium - 1, hard - 2, extreme - 3")

    switch (difficulty) {
        case '0':
            lives = 30
            break
        case '1':
            lives = 20
            break
        case '2':
            lives = 15
            break
        case '3':
            lives = 1
            break
        default:
            alert("You entered wrong number")
            location.reload()
            break
    }
}

difficulties()

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.pos_x, paddle.pos_y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.strokeStyle = paddle.strokeColor
    ctx.strokeRect(paddle.pos_x, paddle.pos_y, paddle.width, paddle.height)
    ctx.fill();
    ctx.closePath();
}

document.addEventListener("keydown", function (arrow) {
    if (arrow.keyCode == 37) {
        left_arrow = true
    } else if (arrow.keyCode == 39) {
        right_arrow = true
    }
})

document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37) {
        left_arrow = false
    } else if (event.keyCode == 39) {
        right_arrow = false
    }
})

function movePaddle() {
    if (left_arrow && paddle.pos_x > 0) {
        paddle.pos_x -= paddle.offset
    }
    if (right_arrow && paddle.pos_x < canvas.width - paddle.width) {
        paddle.pos_x += paddle.offset
    }
}

ball = {
    pos_x: canvas.width / 2,
    pos_y: paddle.pos_y - BALL_RADIUS,
    radius: BALL_RADIUS,
    ballSpeed: 4,
    color: 'white',
    offset_x: 2,
    offset_y: -2
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.pos_x, ball.pos_y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function level_up() {
    if (level < 4) {
        paddle.width = paddle.width - 25
    }
    destroyed_blocks = 0
    amount_of_blocks = 0
    createBricks()
    drawBricks()
}

function levels() {
    switch (level) {
        case 2:
            brick.row = 7
            brick.col = 6
            level_up()
            break;
        case 3:
            brick.row = 5
            brick.col = 6
            level_up()
            break;
        case 4:
            level_up()
            break;
        case 5:
            level_up()
            break;
    }
}

function setBallDefaultPosition() {
    ball.ballSpeed = 4
    ball.pos_x = canvas.width / 2
    ball.pos_y = paddle.pos_y - BALL_RADIUS
    ball.offset_x = 2
    ball.offset_y = -2
}

function moveBall() {
    ball.pos_x += ball.offset_x;
    ball.pos_y += ball.offset_y;

    if (ball.pos_x + ball.radius > canvas.width) {
        ball.offset_x = -ball.offset_x
    }

    if (ball.pos_x - ball.radius < 0) {
        ball.offset_x = -ball.offset_x
    }

    if (ball.pos_y - ball.radius < 0) {
        ball.offset_y = -ball.offset_y
    }
    if (ball.pos_y + ball.offset_y > canvas.height) {
        lives -= 1
        setBallDefaultPosition()
    }
}

function paddleHits() {

    if (ball.pos_x < paddle.pos_x + paddle.width && ball.pos_x > paddle.pos_x && paddle.pos_y < paddle.pos_y + paddle.height && ball.pos_y > paddle.pos_y) {

        let paddle_hit_point = ball.pos_x - (paddle.pos_x + paddle.width / 2)
        paddle_hit_point = paddle_hit_point / (paddle.width / 2)
        let hit_angle = paddle_hit_point * Math.PI / 3
        ball.offset_x = ball.ballSpeed * Math.sin(hit_angle)
        ball.offset_y = -ball.ballSpeed * Math.cos(hit_angle)
        if (level > 3) {
            if (ball.ballSpeed < 6) {
                ball.ballSpeed = ball.ballSpeed + 0.5
            }
        }
    }
}

brick = {
    row: 5,
    column: 6,
    width: 75,
    height: 30,
    offset_between_bricks: 20,
    offset_top: 20,
    upper_margin: 40,
    main_color: "#FFFFFF",
    edge_color: "#FFFFF"
}

let bricks = []
function createBricks() {
    for (let row = 0; row < brick.row; row++) {
        bricks[row] = [];
        for (let col = 0; col < brick.column; col++) {
            x = Math.floor((Math.random() * 10) + 1)
            if (level == 2 || level == 4) {
                amount_of_blocks++
                bricks[row][col] = {
                x: col * (brick.offset_between_bricks + brick.width) + brick.offset_between_bricks,
                y: row * (brick.offset_top + brick.height) + brick.offset_top + brick.upper_margin,
                not_broken: true,
                color_of_brick: getRandomColor(),
                death_block: false,
                destroyable: true
                }
            } else if (level == 3) {
                bricks[row][col] = {
                    x: col * (brick.offset_between_bricks + brick.width) + brick.offset_between_bricks,
                    y: row * (brick.offset_top + brick.height) + brick.offset_top + brick.upper_margin,
                    not_broken: true,
                    color_of_brick: getRandomColor(),
                    death_block: false,
                    destroyable: true
                }
            if (row == 4 && (col == 1 || col == 2 || col == 4 )) {
                bricks[row][col].destroyable = false
            } else {
                amount_of_blocks++
            }
        }
         
            else if (level == 5) {
            bricks[row][col] = {
                x: col * (brick.offset_between_bricks + brick.width) + brick.offset_between_bricks,
                y: row * (brick.offset_top + brick.height) + brick.offset_top + brick.upper_margin,
                not_broken: true,
                color_of_brick: getRandomColor(),
                death_block: false,
                destroyable: true
            }
            if (x % 7 == 0) {
                bricks[row][col].death_block = true
            }
            else {
                amount_of_blocks++
            }
        }

        else {

            if (x % 2 != 0) {
                bricks[row][col] = {
                    not_broken: false
                }
            } else {
                amount_of_blocks++
                bricks[row][col] = {
                    x: col * (brick.offset_between_bricks + brick.width) + brick.offset_between_bricks,
                    y: row * (brick.offset_top + brick.height) + brick.offset_top + brick.upper_margin,
                    not_broken: true,
                    color_of_brick: getRandomColor(),
                    death_block: false,
                    destroyable: true
                }
            }

            }
        }

    }
}

createBricks();

function drawBricks() {
    for (let row = 0; row < brick.row; row++) {
        for (let col = 0; col < brick.column; col++) {
            b = bricks[row][col]
            if (b.not_broken) {
                if (b.death_block) {
                    ctx.fillStyle = "#FF2400"
                } else if (b.destroyable == true) {
                    ctx.fillStyle = "#FFFFFF"
                } else {
                    ctx.fillStyle = "#000000"
                }
                ctx.fillRect(b.x, b.y, brick.width, brick.height)
                ctx.strokeStyle = brick.edge_color
                ctx.strokeRect(b.x, b.y, brick.width, brick.height)
            }
        }
    }
    brick_color_set = false
}

function ballBrickCollision() {
    for (let row = 0; row < brick.row; row++) {
        for (let col = 0; col < brick.column; col++) {
            b = bricks[row][col]
            if (b.not_broken) {
                if (ball.pos_x + ball.radius > b.x
                    && ball.pos_x - ball.radius < b.x + brick.width
                    && ball.pos_y + ball.radius > b.y
                    && ball.pos_y - ball.radius < b.y + brick.height
                    && b.death_block == false) {

                    if (b.destroyable) {
                        b.not_broken = false
                        destroyed_blocks += 1
                        score += level * 1
                    }

                    ball.offset_y = - ball.offset_y;

                    if (destroyed_blocks == amount_of_blocks) {
                        level++
                        levels()
                        setBallDefaultPosition()
                    }
                } else if (ball.pos_x + ball.radius > b.x
                    && ball.pos_x - ball.radius < b.x + brick.width
                    && ball.pos_y + ball.radius > b.y
                    && ball.pos_y - ball.radius < b.y + brick.height
                    && b.death_block == true) {

                    b.not_broken = false
                    lives -= 1
                    setBallDefaultPosition()
                }
            }
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function gameOver() {
    if (lives == 0) {
        GAME_OVER = true
        results()
    }
}
function gameWin() {
    if (level == 6) {
        GAME_WIN = true
        results()
    }
}

function results() {
    if (GAME_OVER) {
        printLoser()
    }
    if (GAME_WIN) {
        printWinner()
    }
}

function currentLevel() {
    ctx.font = "22px Arial ";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("Level: " + level, canvas.width/2, 20);
}

function drawLives() {
    ctx.font = "22px Arial ";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width-5, 20);
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 5 , 20);
}

const start = document.getElementById("start");
const space = document.getElementById("space")
const finalScore = document.getElementById("score")
const restart = document.getElementById("restart");
const looser = document.getElementById("lose")
const winner = document.getElementById("win")
const gameover = document.getElementById("gameover")


function waitingScreen() {
    document.addEventListener("keydown", function(event){
        if (event.keyCode == 32) {
            start.style.display = "none"
            space.style.display = "none"
            possibleMove = true
        }
    })
}

restart.addEventListener("click", function(){
    location.reload()
})

function printWinner() {
    gameover.style.display = "block";
    winner.style.display = "block";
    restart.style.display = "block";
    finalScore.style.display = "block"
    finalScore.innerHTML = "Score: " + score
}

function printLoser() {
    looser.style.display = "block"
    gameover.style.display = "block";
    restart.style.display = "block";
    finalScore.style.display = "block"
    finalScore.innerHTML = "Score: " + score
}

function draw() {
    waitingScreen()
    drawPaddle()
    drawBall()
    drawBricks()
    drawScore()
    drawLives()
    currentLevel()
}

function move() {

    if (possibleMove) {
        movePaddle()
        moveBall()
    }
    paddleHits()
    ballBrickCollision()
    gameOver()
    gameWin()
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw()
    move()
    if (!GAME_OVER && !GAME_WIN) {
        requestAnimationFrame(startGame)
    }
}

startGame()



