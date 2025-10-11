const favicon = document.querySelector("link[rel='icon']");

const gameboard = document.querySelector(".gameboard");
const player1Symbol = document.querySelector(".scoreboard .player-1 img");
const player2Symbol = document.querySelector(".scoreboard .player-2 img");
const player1Spinner = document.querySelector(".scoreboard .player-1 .spinner");
const player2Spinner = document.querySelector(".scoreboard .player-2 .spinner");
const player1Score = document.querySelector(".scoreboard .values .p1-value");
const player2Score = document.querySelector(".scoreboard .values .p2-value");
const ROWS = 6;
const COLS = 7;
const players = ["red", "yellow"];
const player1 = players[Math.floor(Math.random() * 2)];
const player2 = player1 === "red" ? "yellow" : "red";
let current = [player1, player2][Math.floor(Math.random() * 2)];
let highest = [5, 5, 5, 5, 5, 5, 5];
let matrix = [];
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  setScoreboard();
  setGameboard();
  console.log("Player 1", player1);
  console.log("Player 2", player2);
  console.log("Current", current);
});

function updateSpinner() {
  // update the spinner for the current player
  [player1Spinner, player2Spinner].forEach((spinner) => {
    spinner.style.visibility = "hidden";
    spinner.style.opacity = "0";
  });
  if (current === player1) {
    player1Spinner.style.visibility = "visible";
    player1Spinner.style.opacity = "1";
  } else {
    player2Spinner.style.visibility = "visible";
    player2Spinner.style.opacity = "1";
  }
}

function setScoreboard() {
  let redPiecePath = "assets/buttons/BTN_RED_CIRCLE_IN.webp";
  let yellowPiecePath = "assets/buttons/BTN_ORANGE_CIRCLE_IN.webp";
  player1Symbol.src = player1 === "red" ? redPiecePath : yellowPiecePath;
  player2Symbol.src = player2 === "red" ? redPiecePath : yellowPiecePath;
  updateSpinner();
}

function setGameboard() {
  for (let r = 0; r < ROWS; ++r) {
    let row = [];
    for (let c = 0; c < COLS; ++c) {
      const newCell = document.createElement("div");
      newCell.classList = "cell";
      newCell.id = r + "-" + c;
      gameboard.appendChild(newCell);
      row.push("");
    }
    matrix.push(row);
  }
  // event delegation
  gameboard.addEventListener("click", setPiece);
}

function setPiece(event) {
  if (gameOver) return;
  const coords = event.target.id.split("-");
  let r = highest[coords[1]];
  let c = coords[1];
  if (r >= 0) {
    const cell = document.getElementById(`${r}-${c}`);
    cell.classList.add("fade-piece");
    matrix[r][c] = current;
    paint(cell);
    checkWinner();
    // after checkWinner() - gameOver will possibly change it's value
    if (!gameOver) {
      updateCurrent();
      updateSpinner();
    }
    --highest[coords[1]];
  }
}

function paint(cell) {
  if (current === "red") {
    cell.style.backgroundImage =
      "url(./assets/buttons/BTN_RED_CIRCLE_OUT.webp)";
  } else {
    cell.style.backgroundImage =
      "url(./assets/buttons/BTN_ORANGE_CIRCLE_OUT.webp)";
  }
}

function updateCurrent() {
  current === player1 ? (current = player2) : (current = player1);
}

function checkWinner() {
  // horizontally
  for (let r = 0; r < ROWS; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (
        matrix[r][c] === matrix[r][c + 1] &&
        matrix[r][c + 1] === matrix[r][c + 2] &&
        matrix[r][c + 2] === matrix[r][c + 3] &&
        matrix[r][c] !== ""
      ) {
        return endGame([r, c], [r, c + 1], [r, c + 2], [r, c + 3]);
      }
    }
  }

  // vertically
  for (let c = 0; c < COLS; ++c) {
    for (let r = 0; r < 3; ++r) {
      if (
        matrix[r][c] === matrix[r + 1][c] &&
        matrix[r + 1][c] === matrix[r + 2][c] &&
        matrix[r + 2][c] === matrix[r + 3][c] &&
        matrix[r][c] !== ""
      ) {
        return endGame([r, c], [r + 1, c], [r + 2, c], [r + 3, c]);
      }
    }
  }

  // main diag
  for (let r = 0; r < 3; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (
        matrix[r][c] === matrix[r + 1][c + 1] &&
        matrix[r + 1][c + 1] === matrix[r + 2][c + 2] &&
        matrix[r + 2][c + 2] === matrix[r + 3][c + 3] &&
        matrix[r][c] !== ""
      ) {
        return endGame([r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]);
      }
    }
  }

  // secondary diag
  for (let r = 0; r < 3; ++r) {
    for (let c = 3; c < COLS; ++c) {
      if (
        matrix[r][c] === matrix[r + 1][c - 1] &&
        matrix[r + 1][c - 1] === matrix[r + 2][c - 2] &&
        matrix[r + 2][c - 2] === matrix[r + 3][c - 3] &&
        matrix[r][c] !== ""
      ) {
        return endGame([r, c], [r + 1, c - 1], [r + 2, c - 2], [r + 3, c - 3]);
      }
    }
  }
}

function endGame(...coords) {
  gameOver = true;
  animateWinner(coords);
  updateScores();
  setTimeout(restartGame, 2500);
}

function animateWinner(coords) {
  let pieces = [];
  coords.forEach((coord) =>
    pieces.push(document.getElementById(`${coord[0]}-${coord[1]}`))
  );
  pieces.forEach((piece, index) =>
    setTimeout(() => {
      piece.classList.add("blink");
    }, 80 * index)
  );
}

function updateScores() {
  current === player1
    ? (increment(player1Score), animateScore(player1Score))
    : (increment(player2Score), animateScore(player2Score));
}

function increment(score) {
  let value = Number(score.textContent);
  score.textContent = (++value).toString();
}

function animateScore(score) {
  score.classList.add("anim-score");
  score.addEventListener("animationend", () => {
    score.classList.remove("anim-score");
  });
}

function restartGame() {
  gameboard.innerHTML = null;
  gameOver = false;
  current = [player1, player2][Math.floor(Math.random() * 2)];
  highest = [5, 5, 5, 5, 5, 5, 5];
  matrix = [];
  setGameboard();
}
