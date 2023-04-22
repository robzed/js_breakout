const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddle
let paddleWidth = canvas.width * 0.15;
let paddleHeight = canvas.height * 0.025;
let paddleSpeed = canvas.width * 0.012;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball
let ballRadius = canvas.height * 0.02;
let ballX = canvas.width / 2;
let ballY = canvas.height - (canvas.height * 0.1);
let dx = canvas.width * 0.004;
let dy = -canvas.height * 0.006;

// Bricks
const brickRowCount = 5;
const brickColumnCount = 8;
let brickWidth = canvas.width * 0.1;
let brickHeight = canvas.height * 0.05;
let brickPadding = canvas.width * 0.01;
let brickOffsetTop = canvas.height * 0.1;
let brickOffsetLeft = canvas.width * 0.04;

function reset_ball_speed() {
    dx = canvas.width * 0.004;
    dy = -canvas.height * 0.006;
}

function update_game_elements(old_width, old_height) {
    // Paddle
    paddleWidth = canvas.width * 0.15;
    paddleHeight = canvas.height * 0.025;
    paddleSpeed = canvas.width * 0.012;
    paddleX = (canvas.width - paddleWidth) / 2;

    // Ball
    ballRadius = canvas.height * 0.02;
    ballX = (ballX / old_width) * canvas.width;
    ballY = (ballY / old_height) * canvas.height;
    //ballX = canvas.width / 2;
    //ballY = canvas.height - (canvas.height * 0.1);
    dx = canvas.width * 0.004;
    dy = -canvas.height * 0.006;

    // Bricks
    brickWidth = canvas.width * 0.1;
    brickHeight = canvas.height * 0.05;
    brickPadding = canvas.width * 0.01;
    brickOffsetTop = canvas.height * 0.1;
    brickOffsetLeft = canvas.width * 0.04;
}

const bricks = [];

// Scoring
let score = 0;
let lives = 13; // originally 3


for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  undo_ball_position_scaling();

  // Update canvas size
  let old_width = canvas.width
  let old_height = canvas.height

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update game elements based on the new canvas size
  update_game_elements(old_width, old_height);

  // Redraw the game
  //draw();
}


let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('touchstart', touchStartHandler);
document.addEventListener('touchmove', touchMoveHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

let touchX;

function touchStartHandler(e) {
  if (e.touches.length === 1) {
    touchX = e.touches[0].clientX;
  }
}

function touchMoveHandler(e) {
  if (e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - touchX;
    touchX = e.touches[0].clientX;

    paddleX += deltaX;
    if (paddleX < 0) {
      paddleX = 0;
    } else if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }

    e.preventDefault();
  }
}


function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

const brickColors = ['#FFA07A', '#7FFF00', '#1E90FF', '#FFD700', '#DC143C'];


function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColors[r % brickColors.length]; // Set the fillStyle based on the row index
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}



//function drawBricks() {
//  for (let c = 0; c < brickColumnCount; c++) {
//   for (let r = 0; r < brickRowCount; r++) {
//      if (bricks[c][r].status === 1) {
//        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
//        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
//        bricks[c][r].x = brickX;
//        bricks[c][r].y = brickY;
//        ctx.beginPath();
//        ctx.rect(brickX, brickY, brickWidth, brickHeight);
//        ctx.fillStyle = '#0095DD';
//        ctx.fill();
//        ctx.closePath();
//      }
//    }
//  }
//}


function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('Congratulations, you won!');
            document.location.reload();
          }
        }
      }
    }
  }
}



function old_collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
    dx = -dx;
  }

  if (ballY + dy < ballRadius) {
    dy = -dy;

} else if (ballY + dy > canvas.height - ballRadius) {
  if (ballX > paddleX && ballX < paddleX + paddleWidth) {
    // Calculate the relative position of the ball on the paddle (0 to 1)
    const relativeBallPos = (ballX - paddleX) / paddleWidth;

    // Calculate the angle based on the relative position of the ball on the paddle
    const angle = ((relativeBallPos - 0.5) * Math.PI * 2 /3 )+Math.PI/6;

    // Update the ball's velocities based on the angle
    const paddleSpeedFactor = 0.5; // Adjust this value to control how much paddle speed affects the ball speed

    ball_speed = Math.sqrt(dx*dx + dy*dy);
    // maybe should calculate ball angle - or in fact track angle and ball speed thoughout code, and 
    // then just adjust angle here? 

    dx = Math.sin(angle) * ball_speed * 1.2 + paddleSpeedFactor * (rightPressed - leftPressed) * paddleSpeed;
    dy = -Math.cos(angle) * ball_speed;

//  } else if (ballY + dy > canvas.height - ballRadius) {
//    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
//      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert('Game Over');
        document.location.reload();
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        reset_ball_speed();
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  ballX += dx;
  ballY += dy;
  requestAnimationFrame(draw);
}

draw();



