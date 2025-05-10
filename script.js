const Game = (function() {
    // hold game board in code
    const Board = new Array(9).fill('');
    // is the current game on the board a win/loss/draw
    let gameResult = null;
    //holds player objects in an array
    let players = ['',''];
    //keeps track of who's turn it is
    let activePlayer;
    function startNewGame(firstPlayerName,secondPlayerName) {
        players[0] = firstPlayerName;
        players[1] = secondPlayerName;
        activePlayer = players[0];
        Board.fill('');
        gameResult = null;
    }
    //check for a win
    function updateGameStatus() {

    }
    function constructBoardString(padding = 1) {
        //lines of board without horizontal separating lines
        let lengthWithoutLines = padding*2*3+3;
        let paddedQuadrantLength = lengthWithoutLines / 3;
        let linesWithLetters = [];
        //get the lines that contain numbers
        for (let a = 1,b = (paddedQuadrantLength+1) / 2; a <= 3;a++) {
            linesWithLetters.push(b + 3(n-1));
        }
        return linesWithLetters();
    }
    function printBoard() {
        switch (gameResult) {
            case null:
                
                break;
            case "draw":
                break;
            default:
                break;
        }
    }
    function mark(position) {

    }
    return {constructBoardString};
})();