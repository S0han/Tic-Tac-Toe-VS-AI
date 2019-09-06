//this is the regaular default board
var defaultBoard;

//this is the code for the players 
const livePlayer = 'O';
const aiPlayer = 'X';

//this is the array that contains the winning combos
const winnerCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

//store all the table data with the class of cell in variable
const cells = document.querySelectorAll('.cell');

//call the function that reset the board upon init
playGame();

//code for refreshing the board
function playGame() {
	document.querySelector(".winner").style.display = "none";
	defaultBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

//when a square is clicked the id if the target 
//square is logged in the console
function turnClick(square) {
	if (typeof defaultBoard[square.target.id] == 'number') {
		turn(square.target.id, livePlayer);
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

//logs the square which the player clicks
//it then calls the value that player uses "0"
//and inserts it into the square that matches that ID
function turn(squareId, player) {
	defaultBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;	
	let gameWon = checkWin(defaultBoard, player)
	if (gameWon) endGame(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winnerCombos.entries()){
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}	
	}
	return gameWon;
}

//this determines the message displayed at the end of the game
function endGame(gameWon) {
	for (let index of winnerCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == livePlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false)
	}
	declareWinner(gameWon.player == livePlayer ? "You Win!" : "You Lost....")
}

//endgame function calls upon this function which provides it with "who" won
function declareWinner(who) {
	document.querySelector(".winner").style.display = "block";
	document.querySelector(".winner .text").innerText = who;
}

//figures out which square havent been filled
function emptySquares() {
	return defaultBoard.filter(s => typeof s == 'number');
}

//places unit in the best available slot
function bestSpot() {
	return minimax(defaultBoard, aiPlayer).index;
}

//check to see if neither player won aka. TIE GAME
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//minimax function allows the AI to pick the best available slot
function minimax(newBoard, player) {
	var openSpots = emptySquares(newBoard);

	if (checkWin(newBoard, livePlayer)) {
		return {score: -10};
	}
	else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}
	else if (openSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < openSpots.length; i++) {
		var move = {};
		move.index = newBoard[openSpots[i]];
		newBoard[openSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, livePlayer);
			move.score = result.score;
		}
		else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[openSpots[i]] = move.index;

		moves.push(move);
	}
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++){
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
	var bestScore = 10000;
	for (var i = 0; i < moves.length; i++){
		if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}