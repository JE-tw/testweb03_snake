const CANVAS = document.getElementById("gameCanvas");
const ctx = CANVAS.getContext("2d");
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

const unit = 20;
const row = CANVAS.height / unit; //20
const column = CANVAS.width / unit; //20

let snake = []; //蛇身位置紀錄
let ax = 0,
  ay = 0; //蘋果座標
let direction = "Right"; //蛇前進方向，預設往右

let score = 0; //紀錄分數
document.getElementById("game_score").innerHTML = "遊戲分數:" + score;
let highestScore; //紀錄最高分
LoadHightestScore();
document.getElementById("high_score").innerHTML = "最高分數:" + highestScore;

//初始蛇座標
snake[0] = { x: 80, y: 0 };
for (let index = 1; index < 4; index++) {
  snake[index] = { x: 80 - unit * index, y: 0 };
}
//繪製蛇
function draw() {
  //console.log("drawing...");
  for (let index = 0; index < snake.length; index++) {
    ctx.fillStyle = "black";
    ctx.fillRect(snake[index].x, snake[index].y, unit, unit); //fillRect(x, y, width, height);
    ctx.strokeStyle = "white"; //外框顏色
    ctx.strokeRect(snake[index].x, snake[index].y, unit, unit);
  }
  //畫蘋果
  ctx.fillStyle = "red";
  ctx.fillRect(ax, ay, unit, unit);
}
//移動
function move() {
  let s_x = snake[0].x;
  let s_y = snake[0].y;
  switch (direction) {
    case "Right":
      s_x += unit;
      break;

    case "Left":
      s_x -= unit;
      break;

    case "Up":
      s_y -= unit;
      break;

    case "Down":
      s_y += unit;
      break;

    default:
      break;
  }
  if (s_x >= CANVAS.width) {
    s_x = 0;
  }
  if (s_y >= CANVAS.height) {
    s_y = 0;
  }
  if (s_x < 0) {
    s_x = CANVAS.width;
  }
  if (s_y < 0) {
    s_y = CANVAS.height;
  }

  let newHead = { x: s_x, y: s_y };
  snake.unshift(newHead);
  //console.log(newHead);

  //結束判定
  for (let index = 1; index < snake.length; index++) {
    if (snake[index].x == s_x && snake[index].y == s_y) {
      console.log("game over");
      gameOver();
      return;
    }
  }

  //蘋果判定
  if (s_x == ax && s_y == ay) {
    makeApple();
    score += 10;
    setHighScore(score);
    document.getElementById("game_score").innerHTML = "遊戲分數:" + score;
  } else {
    snake.pop();
  }
}
//重製(塗白)畫布
function clean() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

//執行
function play() {
  clean();
  draw();
  move();
}

//產生蘋果
function makeApple() {
  let k = true;
  do {
    ax = unit * getRandomInt(0, column);
    ay = unit * getRandomInt(0, row);
    snake.forEach((e) => {
      if (e.x == ax && e.y == ay) {
        k == false;
        return;
      }
    });
  } while (k == false);
  // console.log(ax, "+", ay);
}

//game over
function gameOver() {
  clearInterval(myGame);
  alert("遊戲結束 分數: " + score);
  setHighScore(score);
}

//最高分
function LoadHightestScore() {
  if (Number(localStorage.getItem("highestScore") == null)) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
  }
}

//區間內隨機整數
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/***********************begin************************/
makeApple();
let myGame = setInterval(play, 100); //每100秒執行一次draw

//方向鍵事件
window.addEventListener(
  "keydown",
  function (event) {
    let k = event.key;
    switch (k) {
      case "ArrowUp":
        if (direction == "Down") {
          break;
        }
        direction = "Up";
        break;
      case "ArrowDown":
        if (direction == "Up") {
          break;
        }
        direction = "Down";
        break;
      case "ArrowRight":
        if (direction == "Left") {
          break;
        }
        direction = "Right";
        break;
      case "ArrowLeft":
        if (direction == "Right") {
          break;
        }
        direction = "Left";
        break;

      default:
        break;
    }
  },
  true
);
