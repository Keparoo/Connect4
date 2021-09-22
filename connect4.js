/* Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * the board is filled (tie)
 * 
 */

footer = document.querySelector('#footer')
button = document.querySelector('#reset')

class Game {
    constructor(p1, p2, height = 6, width = 7) {
		const isColor = (strColor) => {
			const option = new Option().style;
			option.color = strColor;
			return option.color === strColor;
		};
		// Check both colors are valid different colors
		if (isColor(p1.color) && isColor(p2.color) && p1.color !== p2.color) {
			this.p1 = p1;
			this.p2 = p2;
			document.querySelector('#footer').innerText = '';
		} else {
			document.querySelector('#footer').innerText =
				'Please enter 2 valid different colors!';
			throw new Error('Invalid Color');
		}

		this.WIDTH = width;
		this.HEIGHT = height;
		this.currPlayer = this.p1; // active player: 1 or 2
		this.board = [];
		this.htmlBoard = ''; // array of rows, each row is array of cells  (board[y][x])
		this.makeBoard();
		this.makeHtmlBoard();
        document.body.classList.add('start-color')
        document.body.classList.remove('win-color')

		this.gameOver = false;
	}
    
    //create JS repr of board: array or rows, each row array of cells (board[y][x])
    makeBoard() {
        this.board = [];
        for (let row = 0; row < this.HEIGHT; row++) {
            // Creates an array of WIDTH length with undefined at each index
            this.board.push(Array.apply(null, { length: this.WIDTH }));
        }
    };

    //create HTML representation of board: HTML table and row of column tops
    makeHtmlBoard() {
        this.htmlBoard = document.getElementById('board')
        this.htmlBoard.innerHTML = '';

        // Create top row (tr) of board to accept click events
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        this.bindGameClick = this.handleClick.bind(this);
        top.addEventListener('click', this.bindGameClick);

        // Set up the tds of tr and assign each td and id of the x position
        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }
        this.htmlBoard.append(top);

        // Create the HTML board for play as a table, each td having ids of x-y
        // where x and y are the coordinate indexes
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }
            this.htmlBoard.append(row);
        }
        button.innerText = 'Reset Game'
        footer.innerText = `${this.currPlayer.color} player's turn`
    };

    // Validate legal color
	isColor(strColor) {
		const option = new Option().style;
		option.color = strColor;
		return option.color === strColor;
	}

    // return y coord of next available grid space or null if column is filled
    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) return y;
        }
        return null;
    };

    // place a piece in HTML table at passed coords. Set color based on player number
    placeInTable(y, x) {
        const newPiece = document.createElement('div');
        newPiece.classList.add('piece');

        newPiece.style.backgroundColor = this.currPlayer.color
        // newPiece.classList.add(`p${currPlayer}`);

        const square = document.getElementById(`${y}-${x}`);
        square.append(newPiece);
    };

    // Alert player that game is over with passed msg
    endGame(msg) {
        const top = document.querySelector('#column-top');
        top.removeEventListener('click', this.bindGameClick);
        document.body.classList.toggle('win-color')
        document.body.classList.toggle('start-color')
		document.querySelector('#footer').innerText = msg;

        // gameMessage.innerText = msg;
        // resetButton.classList.remove('hidden');
    };

    // checkForWin: check board cell-by-cell for "does a win start here?"
    checkForWin() {
        const _win = (cells) => {
            // check array of 4 (y, x) array pairs (coords)
            // If the coordinates are valid (on the board)
            // check to see if they are all the same color (player) if so return true
            return cells.every(
                ([ y, x ]) =>
                    y >= 0 &&
                    y < this.HEIGHT &&
                    x >= 0 &&
                    x < this.WIDTH &&
                    this.board[y][x] === this.currPlayer
            );
        };
        this.bindWin = _win.bind(this);

        // loop through each square on the board, use each square as a starting
        // point to check for 4 in a row
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
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
                if (this.bindWin(horiz) || this.bindWin(vert) || this.bindWin(diagDR) || this.bindWin(diagDL)) {
                    return true;
                }
            }
        }
    };

    // When square of top row is clicked, attempt to put piece in that column
    handleClick(evt) {
        const topRow = document.querySelector('#column-top');
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) return;

        // place piece in HTML board correspoding JS array representation
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            // topRow.removeEventListener('click', handleClick);
            return this.endGame(`The ${this.currPlayer.color} player  won!`);
        }

        // Check if all cells on board are filled, if so end game as a tie
        if (this.board.every((row) => row.every((square) => square))) {
            // topRow.removeEventListener('click', handleClick);

            return this.endGame('Player 1 and 2 have Tied!');
        }

        // Change current player to other player
        this.currPlayer === this.p1
        ? (this.currPlayer = this.p2)
        : (this.currPlayer = this.p1);
        footer.innerText = `${this.currPlayer.color} player's turn`
    };

}

class Player {
	constructor(color) {
		this.color = color;
	}
}

document.querySelector('#colors').addEventListener('submit', (e) => {
    e.preventDefault()
	let p1 = new Player(document.querySelector('#p1color').value);
	let p2 = new Player(document.querySelector('#p2color').value);
	new Game(p1, p2);
});
