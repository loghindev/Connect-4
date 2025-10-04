const gameboard = document.querySelector(".gameboard");
const ROWS = 6;
const COLS = 7;
const players = ["red", "yellow"];
const player1 = players[Math.floor(Math.random() * 2)];
const player2 = player1 === players[0] ? players[1] : players[0];
let current = [player1, player2][Math.floor(Math.random() * 2)];
let gameOver = false;
let matrix = [];
let moves = 0;
let highest = [5, 5, 5, 5, 5, 5, 5];

window.onload = () => generateGameboard();

function generateGameboard() {
  for (let r = 0; r < ROWS; ++r) {
    let row = [];
    for (let c = 0; c < COLS; ++c) {
      const newCell = document.createElement("div");
      newCell.classList.add("cell");
      newCell.id = r + "-" + c;
      newCell.addEventListener("click", setPiece);
      gameboard.appendChild(newCell);
      row.push("");
    }
    matrix.push(row);
  }
}

function setPiece(event) {
  if (gameOver) return;
  let coords = event.target.id.split("-");
  let r = highest[coords[1]];
  let c = coords[1];
  if (r >= 0) {
    matrix[r][c] = current; // easier to check the winner
    let cell = document.getElementById(`${r}-${c}`);
    if (current === "red") {
      cell.style.backgroundColor = "red";
    } else {
      cell.style.backgroundColor = "yellow";
    }
    current === player1 ? (current = player2) : (current = player1);
    --highest[coords[1]];
    if (++moves < ROWS * COLS) {
      checkWinner();
    } else {
      displayTie();
    }
  }
}

function checkWinner() {
  // on columns
  for (let r = 0; r < ROWS; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (
        matrix[r][c] === matrix[r][c + 1] &&
        matrix[r][c + 1] === matrix[r][c + 2] &&
        matrix[r][c + 2] === matrix[r][c + 3] &&
        matrix[r][c] !== ""
      ) {
        return displayWinner([r, c], [r, c + 1], [r, c + 2], [r, c + 3]);
      }
    }
  }

  // on rows
  for (let c = 0; c < COLS; ++c) {
    for (let r = 0; r < 3; ++r) {
      if (
        matrix[r][c] === matrix[r + 1][c] &&
        matrix[r + 1][c] === matrix[r + 2][c] &&
        matrix[r + 2][c] === matrix[r + 3][c] &&
        matrix[r][c] !== ""
      ) {
        return displayWinner([r, c], [r + 1, c], [r + 2, c], [r + 3, c]);
      }
    }
  }

  // on main diag
  for (let r = 0; r < 3; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (
        matrix[r][c] === matrix[r + 1][c + 1] &&
        matrix[r + 1][c + 1] === matrix[r + 2][c + 2] &&
        matrix[r + 2][c + 2] === matrix[r + 3][c + 3] &&
        matrix[r][c] !== ""
      ) {
        return displayWinner(
          [r, c],
          [r + 1, c + 1],
          [r + 2, c + 2],
          [r + 3, c + 3]
        );
      }
    }
  }
  // on secondary diag
  for (let r = 0; r < 3; ++r) {
    for (let c = 3; c < COLS; ++c) {
      if (
        matrix[r][c] === matrix[r + 1][c - 1] &&
        matrix[r + 1][c - 1] === matrix[r + 2][c - 2] &&
        matrix[r + 2][c - 2] === matrix[r + 3][c - 3] &&
        matrix[r][c] !== ""
      ) {
        return displayWinner(
          [r, c],
          [r + 1, c - 1],
          [r + 2, c - 2],
          [r + 3, c - 3]
        );
      }
    }
  }
}
function animatePieces(pieces) {
  pieces.forEach((piece, index) =>
    setTimeout(
      () => {
        piece.classList.add("flick");
      },
      pieces.length > 4 ? 20 * index : 100 * index
    )
  );
}

function displayWinner(...coords) {
  gameOver = true;
  let pieces = [];
  coords.forEach((coord) =>
    pieces.push(document.getElementById(`${coord[0]}-${coord[1]}`))
  );
  animatePieces(pieces);
  setTimeout(restartGame, 2500);
}

function displayTie() {
  gameOver = true;
  animatePieces(document.querySelectorAll(".gameboard .cell"));
  setTimeout(restartGame, 3000);
}

function restartGame() {
  gameboard.innerHTML = "";
  matrix = [];
  generateGameboard();
  highest = [5, 5, 5, 5, 5, 5, 5];
  gameOver = false;
  moves = 0;
}
