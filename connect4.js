/* Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * the board is filled (tie)
 * 
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

//create JS repr of board: array or rows, each row array of cells (board[y][x])
const makeBoard = () => {
	for (let row = 0; row < HEIGHT; row++) {
		board.push(Array.from({ length: WIDTH }));
	}
};

//create HTML representation of board: HTML table and row of column tops
const makeHtmlBoard = () => {
	const htmlBoard = document.querySelector('#board');
	// TODO: add comment for this code

	// Create top row (tr) of board to accept click events
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Set up the tds of tr and assign each td and id of the x position
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Create the HTML board for play as a table, each td having ids of x-y
	// where x and y are the coordinate indexes
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

// return y coord of next available grid space or null if column is filled
const findSpotForCol = (x) => {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
};

// place a piece in HTML table at passed coords. Set color based on player number
const placeInTable = (y, x) => {
	const newPiece = document.createElement('div');
	newPiece.classList.add('piece');
	newPiece.classList.add(`p${currPlayer}`);
	const square = document.getElementById(`${y}-${x}`);
	square.append(newPiece);
};

// Alert player that game is over with passed msg
const endGame = (msg) => {
	alert(msg);
};

// When square of top row is clicked, attempt to put piece in that column
const handleClick = (evt) => {
	// get x from ID of clicked cell
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in HTML board correspoding JS array representation
	board[y][x] = currPlayer;
	placeInTable(y, x);
	console.log('piece placed');

	// check for win
	if (checkForWin()) {
		console.log('game won');
		return endGame(`Player ${currPlayer} won!`);
	}

	// Check if all cells on board are filled, if so end game as a tie
	if (board.every((row) => row.every((square) => square))) {
		return endGame('Tie!');
	}

	// Change current player to other player
	currPlayer = currPlayer === 1 ? 2 : 1;
};

// checkForWin: check board cell-by-cell for "does a win start here?"
const checkForWin = () => {
	const _win = (cells) => {
		// check array of 4 (y, x) array pairs (coords)
		// If the coordinates are valid (on the board)
		// check to see if they are all the same color (player) if so return true
		return cells.every(
			([ y, x ]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	};

	// loop through each square on the board, use each square as a starting
	// point to check for 4 in a row
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// collect the 4 cells horizontally to right
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			// collect the 4 cells vertically down
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			//collect the 4 cells diagonally down-right
			let diagDR = [
				[ y, x ],
				[ y + 1, x + 1 ],
				[ y + 2, x + 2 ],
				[ y + 3, x + 3 ]
			];
			// collect the 4 cells diagonally up-left
			let diagDL = [
				[ y, x ],
				[ y + 1, x - 1 ],
				[ y + 2, x - 2 ],
				[ y + 3, x - 3 ]
			];

			// Check if any of the 4-sets of 4-adjacent squares are the same color
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
};

makeBoard();
makeHtmlBoard();
