const Game = (function() {
    // hold game board in code
    const Board = new Array(9).fill(' ');
    // is the current game on the board a win/loss/draw
    let gameResult = undefined;
    //holds player objects in an array
    let players = ['',''];
    //keeps track of who's turn it is
    let activePlayer = null;
    function startNewGame(firstPlayerName,secondPlayerName) {
        let letterCheck = /[a-zA-Z]/;
        if (firstPlayerName.length===0 || secondPlayerName.length===0 || !letterCheck.test(firstPlayerName[0]) || !letterCheck.test(secondPlayerName[0])) {
            return false;
        }
        players[0] = firstPlayerName;
        players[1] = secondPlayerName;
        activePlayer = players[0];
        Board.fill(' ');
        gameResult = null;
        printBoard();
        return true;
    }
    //check for a win/draw
    function updateGameStatus() {
        let possibilities = [
            //rows
            [0,1,2],
            [3,4,5],
            [6,7,8],
            //columns
            [0,3,6],
            [1,4,7],
            [2,5,8],
            //diagonals
            [0,4,8],
            [6,4,2]
        ];
        //check possibilities
        for (let possibility of possibilities) {
            if (Board[possibility[0]]===Board[possibility[1]] && Board[possibility[1]]===Board[possibility[2]] && Board[possibility[2]]!==' ') {
                gameResult = 'win';
                return;
            }
        }
        let isDraw = true;
        for (let mark of Board) {
            if (mark===' ') {
                isDraw = false;
                break;
            }
        }
        if (isDraw) {
            gameResult = "draw";
        }
    }
    function constructBoardString(padding = 1) {
        let boardString = '\n';
        //this is without the separation lines
        //that are normally on a tic tac toe board
        let BoardLengthWithoutLines = (padding*2+1)*3;
        let paddedQuadrantLength = BoardLengthWithoutLines / 3;
        let linesWithLetters = [];
        //get the lines that contain numbers
        for (let a = 1,b = (paddedQuadrantLength+1) / 2; a <= 3;a++) {
            linesWithLetters.push(b + paddedQuadrantLength*(a-1));
        }
        for (let line = 1; line <= BoardLengthWithoutLines;line++) {
            let rowIndex
            if ((rowIndex = linesWithLetters.indexOf(line))!==-1) {
                //provide index here starting from zero
                let makeQuadrantLine = function(columnIndex) {
                    let slotIndex = columnIndex+3*rowIndex;
                    let character = Board[slotIndex];
                    if (character===' ') character = slotIndex;
                    return ' '.repeat(padding) 
                    + character
                    + ' '.repeat(padding);
                }
                boardString += makeQuadrantLine(0) + '|' + makeQuadrantLine(1) + '|' + makeQuadrantLine(2);
            } else {
                boardString +=  ' '.repeat(paddedQuadrantLength);
                boardString += '|'
                boardString +=  ' '.repeat(paddedQuadrantLength);
                boardString += '|'
                boardString +=  ' '.repeat(paddedQuadrantLength);
            }        
            if (line!==BoardLengthWithoutLines) {
                boardString += '\n';
                if (line%paddedQuadrantLength===0 && line!==BoardLengthWithoutLines) {
                    boardString += '-'.repeat(BoardLengthWithoutLines+2) + '\n';
                    continue;
                }
            }
        }
        return boardString;
    }
    function printBoard() {
        let board = constructBoardString();
        switch (gameResult) {
            case null:
                console.log(`${activePlayer}'s turn${board}`);
                break;
            case "draw":
                console.log(`It's a draw!${board}`)
                break;
            case 'win':
                console.log(`${activePlayer} wins!${board}`)
                break;
            default:
                break;
        }
    }
    function mark(position) {
        if (gameResult === null) {
            if (Board[position]!==' ') {
                return [false,gameResult,activePlayer,players[(players.indexOf(activePlayer)+1) % 2]];
            } else {
                Board[position] = activePlayer[0];
                updateGameStatus();
                if (gameResult===null) {
                    activePlayer = players[(players.indexOf(activePlayer)+1) % 2];
                }
                printBoard();
                return [true,gameResult,activePlayer,players[(players.indexOf(activePlayer)+1) % 2]];
            }
        }
    }
    return {startNewGame,mark,printBoard};
})();
(function() {
    let dialog = document.body.querySelector('#dialog');
    let form = document.body.querySelector('#dialog-form');
    let dialogBtn = document.body.querySelector('.new-game-btn');
    let firstPlayerInput = document.body.querySelector('#first-player-name');
    let secondPlayerInput = document.body.querySelector("#second-player-name");
    let playerCounters = [document.body.querySelector('.first-player'),document.body.querySelector('.second-player')];
    let resultContainer = document.body.querySelector('.result');
    let playerNames = ['',''];
    let board = document.body.querySelector('.board');
    let slots = board.querySelectorAll('.slot');
    let checkInput = function(inputElement) {
        if (inputElement.validity.patternMismatch) {
            inputElement.setCustomValidity("Name must start with a letter and can only contain letters and numbers.");
        } else {
            inputElement.setCustomValidity('');
        }
    }
    firstPlayerInput.setCustomValidity("Name must start with a letter and can only contain letters and numbers.");
    secondPlayerInput.setCustomValidity("Name must start with a letter and can only contain letters and numbers.");
    dialogBtn.addEventListener('click',() => {
        dialog.showModal();
    });
    firstPlayerInput.addEventListener('input', (event) => {
        checkInput(firstPlayerInput);
    });
    secondPlayerInput.addEventListener('input',(event) => {
        checkInput(secondPlayerInput);
    });
    dialog.addEventListener('close',(event) => {
        if (dialog.returnValue === 'start') {
            let first = firstPlayerInput.value;
            let second = secondPlayerInput.value;
            playerCounters[0].innerText = `${first[0]}  -  0`;
            playerCounters[1].innerText = `${second[0]}  -  0`;
            playerNames[0] = first;
            playerNames[1] = second;
            Game.startNewGame(first,second);
        }
        form.reset();
        dialog.returnValue = "";
    });
    function incrementPlayerCounter(playerName) {
        let counter = playerCounters[playerNames.indexOf(playerName)];
        let match = counter.innerText.match(/^(?<name>[a-zA-z][a-zA-Z0-9]*)  -  (?<score>\d+)$/);
        let score = +match.groups.score;
        let name = match.groups.name;
        counter.innerText = `${name}  -  ${score+1}`;
    }
    board.addEventListener('click',(event) => {
        if (!event.target.classList.contains('slot')) return;
        let slotRegex = /^slot-(?<number>\d+)$/;
        let slotNumber = event.target.classList[0].match(slotRegex);
        let markResult = Game.mark(slotNumber.groups.number - 1);
        if (markResult[0]) {
            if (markResult[1] === 'draw' || markResult[1]==='win') {
                event.target.innerText = markResult[2][0];
                if (markResult[1]==='win') {
                    resultContainer.innerText = `${markResult[2]}\nwins!`
                    resultContainer.style.visibility = 'visible';
                } else {
                    resultContainer.innerText = 'Draw!';
                    resultContainer.style.visibility = 'visible';
                }
                setTimeout(() => {
                    resultContainer.style.visibility = 'hidden';
                    incrementPlayerCounter(markResult[2]);
                    slots.forEach((slot) => {
                        slot.innerText = '';
                    });
                    Game.startNewGame(playerNames[0],playerNames[1]);
                },500);
            } else {
                event.target.innerText = markResult[3][0];
            }
        }
    });
})();