const gameboard = document.querySelector(".gameboard");
const ROWS = 6;
const COLS = 7;
const players = ["red", "yellow"];
const player1 = players[Math.floor(Math.random() * 2)];
const player2 = player1 === "red" ? "yellow" : "red";
let current = [player1, player2][Math.floor(Math.random() * 2)];
let highest = [5, 5, 5, 5, 5, 5, 5];
let matrix = [];
let gameOver = false;

document.addEventListener("DOMContentLoaded", setGameboard);

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
    cell.style.backgroundColor = current;
    matrix[r][c] = current;
    checkWinner();
    updateCurrent();
    --highest[coords[1]];
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
        return foundWinner();
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
        return foundWinner();
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
        return foundWinner();
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
        return foundWinner();
      }
    }
  }
}

function foundWinner() {
  gameOver = true;
  alert(`${current} wins!`);
  setTimeout(restartGame, 2000);
}

function restartGame() {
  gameboard.innerHTML = null;
  gameOver = false;
  current = [player1, player2][Math.floor(Math.random() * 2)];
  highest = [5, 5, 5, 5, 5, 5, 5];
  matrix = [];
  setGameboard();
}
