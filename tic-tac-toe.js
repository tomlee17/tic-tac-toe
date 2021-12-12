"use strict";

const gameBoard = (function() {
    const gridCont = document.querySelector('#gridContainer');
    const gridCell = document.createElement('div');
    gridCell.classList.add('gridCell');

    for (let i = 0; i <= 8; i++) {
        gridCell.id = `${i}`
        gridCont.appendChild(gridCell.cloneNode(true));
    }
    const gridCells = [...gridCont.querySelectorAll('.gridCell')]

    return {
        gridCont,
        gridCells,
    }
})();

const playerFactory = function(marker) {
    return {
        marker,
    }
}

const player1 = playerFactory('O');
const player2 = playerFactory('X');
const playerPC = playerFactory('8');

const winnerProcess = (function() {
    //gameBoard.gridCells.forEach(cell => cell.addEventListener('click', function(e) {}))

    const showResults = function() {
        const cellsArr = gameBoard.gridCells.map(cell => cell.textContent);
        const winMarker = winnerConditionsCheck(cellsArr);
        if (winMarker === player1.marker) commentary.textContent = 'Player 1 wins!';
        if (winMarker === player2.marker) commentary.textContent = 'Player 2 wins!';
        if (winMarker === playerPC.marker) commentary.textContent = 'PC wins!';
        if (winMarker === 'tie') commentary.textContent = 'Tie!';
    }

    const winnerConditionsCheck = function(arr) {
        // horizontal check
        for (let i = 0; i < arr.length; i += 3) {
            if (arr.slice(i, i + 3)
                .every(el => el === arr[i] && el)) return arr[i];
        }
        // vertical check
        for (let j = 0; j < Math.sqrt(arr.length); j++) {
            const vertArr = arr.filter((el, ind) => (ind - j) % Math.sqrt(arr.length) === 0);
            if (vertArr.every(el => el === arr[j] && el)) return arr[j];
        }
        // mainDiag check
        const mainDiag = arr.filter((el, ind) => ind % (Math.sqrt(arr.length) + 1) === 0);
        if (mainDiag.every(el => el === arr[0] && el)) return arr[0];
        // secDiag check
        const secDiag = arr.filter((el, ind) => ind % (Math.sqrt(arr.length) - 1) === 0)
            .slice(1, -1);
        if (secDiag.every(el => el === arr[Math.sqrt(arr.length) - 1] && el)) return arr[Math.sqrt(arr.length) - 1];
        //tie
        if (arr.every(el => el)) return 'tie';
    }
    return {
        showResults,
    }
})();

const displayControl = (function() {
    let playerTrigger;
    let pcTriggered;
    const commentary = document.getElementById('commentary');
    const buttons = [...document.querySelectorAll('button')];
    const buttonHuman = document.getElementById('human');
    const buttonPC = document.getElementById('pc');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            gameBoard.gridCells.forEach(cell => {
                cell.addEventListener('click', addMarker)
            })
        }, { once: true })
    })
    gameBoard.gridCont.addEventListener('click', addPcMarker);

    buttons.forEach(button => button.addEventListener('click', function() {
        button.textContent = 'Restart Game';
        playerTrigger = 0;
        gameBoard.gridCells.forEach(el => el.textContent = '');
        commentary.textContent = 'Player 1\'s turn!';
    }));

    buttonHuman.addEventListener('click', function(e) {
        buttonPC.textContent = 'Start Game vs PC';
        pcTriggered = 0;
    })

    buttonPC.addEventListener('click', function(e) {
        buttonHuman.textContent = 'Start Game vs Human';
        pcTriggered = 1;
    })

    function addMarker() {
        if (!commentary.textContent.includes('turn')) {
            return;
        }
        if (!this.textContent && !playerTrigger) {
            this.textContent = player1.marker;
            if (!pcTriggered) {
                playerTrigger = 'p2';
                commentary.textContent = 'Player 2\'s turn!'
            } else playerTrigger = 'pc';
        }
        if (!this.textContent && playerTrigger === 'p2') {
            this.textContent = player2.marker;
            playerTrigger = 0;
            commentary.textContent = 'Player 1\'s turn!';
        }
        winnerProcess.showResults();
    }

    function addPcMarker() {
        if (!commentary.textContent.includes('turn')) return;
        if (playerTrigger === 'pc') pcRandom();
        winnerProcess.showResults();
    }

    function pcRandom() {
        for (let i = 0; i < 1; i++) {
            const pcChoice = gameBoard.gridCells[Math.floor(Math.random() * 9)];
            if (!pcChoice.textContent) pcChoice.textContent = playerPC.marker;
            else i--;
        }
        playerTrigger = 0;
    }
})();


/*
1) horizontal check
for(i=0;i<arr.length;i++){
    arr[i].every(el=>el===arr[i][0]);    
}  
2) vertical check
for(i=0;i<arr.length-1;i++){
for(j=0;j<arr[i].length;j++){
    arr[i][j]===arr[i+1][j];
}
3) mainDiag check
for(i=0;i<arr.length-1;i++){
for(j=0;j<arr[i].length;j++){
    if(i===j){
    arr[i][j]===arr[i+1][j+1];
    }
}
4) secDiag check
for(i=0;i<arr.length-1;i++){
for(j=0;j<arr[i].length;j++){
    if(i===arr[i].length-1-j){
    arr[i][j]===arr[i+1][j-1];
    }
}
*/
/*
interface:
a 9x9 grid where player can click on each grid

input: 
player 1/2 click event on selected div

output: 
selected div displays O/X depending on player 1/2

1. create gameBoard with 9x9 grids
2. 
*/