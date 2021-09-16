/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	console.log('making board');
	const newRow = [];
	for (let row = 0; row < HEIGHT; row++) {
		for (let column = 0; column < WIDTH; column++) {
			newRow[column] = null;
		}
		board.push(newRow);
	}
	console.log(board);
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	htmlBoard = document.querySelector('#board');
	// TODO: add comment for this code

	// Create top row of board to accept click
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Set up top row with ids of x values
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	// Create the grid for play with x-y ids
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
	// TODO: write the real version of this, rather than always returning 0
	return 0;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
	// TODO: make a div and insert into correct table cell
	const newDiv = document.createElement('div');
	newDiv.classList.add('piece');
	currPlayer === 1 ? newDiv.classList.add('p1') : newDiv.classList.add('p2');
	const square = document.getElementById(y + '-' + x);
	square.appendChild(newDiv);
	console.log(square);
};

/** endGame: announce game end */

const endGame = (msg) => {
	// TODO: pop up alert message
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	placeInTable(y, x);
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	let gameOver = false;
	for (let row = 0; row < HEIGHT; row++) {
		if (row[0].every((val) => val !== null)) gameOver = true;
	}
	if (gameOver) endGame();

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
	const _win = (cells) => {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([ y, x ]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	};

	// TODO: read and understand this code. Add comments to help you.

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [
				[ y, x ],
				[ y + 1, x + 1 ],
				[ y + 2, x + 2 ],
				[ y + 3, x + 3 ]
			];
			let diagDL = [
				[ y, x ],
				[ y + 1, x - 1 ],
				[ y + 2, x - 2 ],
				[ y + 3, x - 3 ]
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
};

makeBoard();
makeHtmlBoard();
