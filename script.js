const playerTurnName = document.getElementById("player-turn");
const result = document.getElementById("result");
const startGame = document.getElementById("start-game");
const resetGame = document.getElementById("reset-game");

let gameStarted = false;

//TODO 1  Create your Gameboard module with a hardcoded array. only need a single instance. wrap the factory inside an IIFE (module pattern).It turns gameboard into the Result of the function, not the function itself
const gameboard = (() => {

    // a. hardcoded array
    const board = ["", "", "", "", "", "", "", "", ""];

    // b. functions to interact with the board (get, set, reset)
    const getBoard = () => board;

    const setBoard = (index, mark) => {
        if (index >=0 && index < board.length && board [index] === "") {
            
                          
            board[index] = mark;
            return true;
            } else {
                console.log("Cell is already occupied");
                return false;
            }


        }
    
    const resetBoard = () => {
        board.fill("");
        

    }
    

    // return an Object containing your functions
    return { getBoard, setBoard, resetBoard };
})();


console.log(gameboard.getBoard());
// console.log(gameboard.setBoard(0, "X"));
// console.log(gameboard.getBoard())
// console.log(gameboard.setBoard(0, "O"));
console.log(gameboard.getBoard());


// Create your Player factory.
const Player = (name, mark, color) => {
    return {name, mark, color};
}

let player1 = Player("Player 1", "X", "#0f172a");
let player2 = Player("Player 2", "O", "#2563eb");



// event listener to start the game when the player clicks the start button 
startGame.addEventListener("click", (e) => {

    e.preventDefault();

    // clear old data
    gameboard.resetBoard();
    gameController.resetGameLogic();


    const p1Input = document.getElementById("player1-name");
    const p2Input = document.getElementById("player2-name");
 

    if (p1Input.value.trim() === "" || p2Input.value.trim() === "") {
        alert("Please enter names for both players.");
        return;
    }

    const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const name1 = formatName(p1Input.value.trim() || "Player 1");
    const name2 = formatName(p2Input.value.trim() || "Player 2");

    player1 = Player(name1, "X", "#0f172a");
    player2 = Player(name2, "O", "#2563eb");

    console.log(player1);
    console.log(player2);

    // lock the settings
    gameStarted = true;
    p1Input.disabled = true;
    p2Input.disabled = true;
    startGame.disabled = true;
    startGame.classList.add("opacity-50", "cursor-not-allowed");

    // clear any old results and start ui
    result.textContent = "";
    displayUi.renderboard();

});

// Create a GameController that manually plays a move.
// Keep track of whose turn it is
// Have a function to play a round (e.g., call gameboard.setBoard).
// Eventually check for a winner.
// include logic that checks for when the game is over!
// You should be checking for all winning 3-in-a-rows and ties.


// GameController IIFE for logic and flow. 

const gameController = (() => {

    // a. new variables to track game state (active player, game over)
    let gameOver = false;
    let activePlayerIndex = 0; 

    // b. winning combinations and logic to check for winner or tie
    const winningArrays = [
        [0, 1, 2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8], 
        [0,4,8], [2,4,6]
    ];


    // c. function to check for winner by comparing the current board state to the winning combinations
    const checkWinner = (mark) => {
        return winningArrays.some(combination => combination.every(index => gameboard.getBoard()[index] === mark)); 
    }

    //d. public method to safely check if the game has ended
    const  isGameOver = () => gameOver;


    // e. function to get the active player 
    const getActivePlayer = () => {
        return activePlayerIndex === 0 ? player1 : player2;
    };
   

    // f. function to switch player turns
    const switchPlayerTurn = () => {
       
        activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;


    }



    //g  play a round 
    
    const playRound = (index) => {

        if (gameOver) {
            console.log("Game is already over. Please reset to play again.");
            return;
        }

        const activePlayer = getActivePlayer();

        // place token
        const success = gameboard.setBoard(index, activePlayer.mark);

        if (success) {
           
           if (checkWinner(activePlayer.mark)) {

                result.textContent = `${activePlayer.name} wins!`;
                gameOver = true;
                return;
            }}

            if (gameboard.getBoard().every(cell => cell !== "")) {
                result.textContent = "It's a tie!";
               gameOver = true;
                return;
            }

            switchPlayerTurn();

    }


    const resetGameLogic = () => {
    gameOver = false;
    activePlayerIndex = 0;
};

        
    return { playRound, getActivePlayer, isGameOver, resetGameLogic };

}
)();


gameboard.getBoard();
// You can call your functions and pass arguments to them to play the game 


// create an object that will handle the display/DOM logic

// gameboard UI iife to handle all display related logic and interactions with the DOM.
const displayUi =(() => {

    // a. get reference to the gameboard container in the DOM
    const gameboardUI = document.getElementById("gameboard-ui");


 

    const renderboard = () => {
        
        // clear the board
        gameboardUI.innerHTML = "";

        // update turn / status message
        if (!gameStarted) {
            playerTurnName.textContent = "Enter names and Start the game to play!";
        } 
        else if (gameController.isGameOver()) {
            playerTurnName.textContent = "";        
        }
        
        else {
      
            const activePlayer = gameController.getActivePlayer();
            playerTurnName.textContent = `${activePlayer.name}'s turn !`;
        }
        

    //  lock the board if not started or if game is over
    const isInactive = !gameStarted || gameController.isGameOver();


        gameboardUI.classList.toggle("pointer-events-none", isInactive);    
        gameboardUI.classList.toggle("opacity-60",  !gameStarted);


        // draw the 9 squares  

        gameboard.getBoard().forEach((cellValue, index) => {

            const cell = document.createElement("div");
            
            cell.textContent = cellValue;

            // color players marker
            if (cellValue === player1.mark) {
                cell.style.color = player1.color;
            } else if (cellValue === player2.mark) {
                cell.style.color = player2.color;
            }


            cell.className = "aspect-square bg-white/80 border border-white text-4xl font-bold flex items-center justify-center shadow-lg hover:bg-white/90 cursor-pointer";

            // add event listener
            cell.addEventListener("click", () => {

                if (!gameStarted) return;

                if (gameStarted && cellValue === "" && !gameController.isGameOver()) {
                    gameController.playRound(index);

                    renderboard();
                
                }
                    
                });

            
            
            gameboardUI.appendChild(cell);
        
        })
    }

    return { renderboard };

})();


displayUi.renderboard();


// reset button 
resetGame.addEventListener("click", () => {
    gameboard.resetBoard();
    gameController.resetGameLogic();
    gameStarted = false;

    // 2. UNLOCK the input boxes and clear them for new names
    const p1Input = document.getElementById("player1-name");
    const p2Input = document.getElementById("player2-name");
    
    p1Input.disabled = false;
    p2Input.disabled = false;

    

    startGame.disabled = false;
    startGame.classList.remove("opacity-50", "cursor-not-allowed");

    result.textContent = "";

    // redraw
    displayUi.renderboard();
});

displayUi.renderboard();

