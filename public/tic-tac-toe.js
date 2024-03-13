window.addEventListener("DOMContentLoaded", event => {
    let alreadyClickedSquares = new Set();
    let validClicksCount = 0;

    let gameBoard = document.getElementById("game-board-table");
    let newGameButton = document.getElementById("new-game-button");
    let giveUpButton = document.getElementById("give-up-button");

    function identifyClickedSquare(event) {
        let square = event.target;
        return square;
    }

    function getNextLetter() {
        if (validClicksCount % 2 === 0) {
            return "x";
        } else {
            return "o";
        }
    }

    function addLetterImage(letter, element) {
        let image = document.createElement("img");

        if (letter === 'x') {
            image.setAttribute("src", "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg");
            image.setAttribute("alt", "x");
        } else if (letter === 'o') {
            image.setAttribute("src", "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg");
            image.setAttribute("alt", "o");
        }

        image.classList.add("letter-image");
        element.appendChild(image);
    }

    function setSquareToLetter(letter, element) {
        addLetterImage(letter, element);
        element.setAttribute("data-contents", letter);
        storeLetterCookie(letter, element);
    }

    function incrementClickTrackers(id) {
        alreadyClickedSquares.add(id);
        validClicksCount++;
    }

    function placeLetter(event) {
        let square = identifyClickedSquare(event);
        let id = square.id;

        if (!alreadyClickedSquares.has(id)) {
            let letter = getNextLetter();

            incrementClickTrackers(id);
            setSquareToLetter(letter, square);
        }

        if (checkWin()) {
            let winner = checkWin();
            endGame(winner);
        }
    }

    function storeLetterCookie(letter, element) {
        let id = element.id;
        let newCookie = id + "=" + letter;
        document.cookie = newCookie;
    }

    function checkWin() {
        if (checkHorizontalWin()) {
            return checkHorizontalWin();
        } else if (checkVerticalWin()) {
            return checkVerticalWin();
        } else if (checkDiagonalWin()) {
            return checkDiagonalWin();
        }

        if (checkBoardFull()) {
            return 'TIE';
        }

        return false;
    }

    function checkBoardFull() {
        let allSquares = document.querySelectorAll("td[data-contents='empty']");
        if (allSquares.length === 0) {
            return true;
        }

        return false;
    }

    function checkRow(row) {
        let allRowSquares = document.querySelectorAll("td[data-row='" + row + "']");
        let dataContent = allRowSquares[0].dataset.contents;

        if (allRowSquares[1].dataset.contents === dataContent && allRowSquares[2].dataset.contents === dataContent) {
            if (dataContent !== "empty") {
                return dataContent;
            }
        }

        return false;
    }

    function checkHorizontalWin() {
        let winner = null;

        if (checkRow("top")) {
            winner = checkRow("top");
        } else if (checkRow("center")) {
            winner = checkRow("center");
        } else if (checkRow("bottom")) {
            winner = checkRow("bottom");
        }

        return winner;
    }

    function checkCol(col) {
        let allColSquares = document.querySelectorAll("td[data-col='" + col + "']");
        let dataContent = allColSquares[0].dataset.contents;

        if (allColSquares[1].dataset.contents === dataContent && allColSquares[2].dataset.contents === dataContent) {
            if (dataContent !== "empty") {
                return dataContent;
            }
        }

        return false;
    }

    function checkVerticalWin() {
        let winner = null;

        if (checkCol("left")) {
            winner = checkCol("left");
        } else if (checkCol("center")) {
            winner = checkCol("center");
        } else if (checkCol("right")) {
            winner = checkCol("right");
        }

        return winner;
    }

    function checkDiagonalWin() {
        let centerSquare = document.getElementById("center-center").dataset.contents;
        if (centerSquare === "empty") {
            return false;
        }

        let topLeft = document.getElementById("top-left").dataset.contents;
        let bottomRight = document.getElementById("bottom-right").dataset.contents;
        if (centerSquare === topLeft && centerSquare === bottomRight) {
            return centerSquare;
        }

        let bottomLeft = document.getElementById("bottom-left").dataset.contents;
        let topRight = document.getElementById("top-right").dataset.contents;
        if (centerSquare === bottomLeft && centerSquare === topRight) {
            return centerSquare;
        }

        return false;
    }

    function setWinnerMessage(winner) {
        let winnerSpan = document.getElementById("winner-span");
        winnerSpan.innerText = winner.toUpperCase();
    }

    function removeWinnerMessage() {
        let winnerSpan = document.getElementById("winner-span");
        winnerSpan.innerText = "";    
    }

    function startGridListeners() {
        gameBoard.addEventListener("click", placeLetter);
    }

    function stopGridListeners() {
        gameBoard.removeEventListener("click", placeLetter);
    }

    function enableGiveUpButton() {
        giveUpButton.classList.remove("disabled");
        giveUpButton.addEventListener("click", handleGiveUpButton);
    }

    function disableGiveUpButton() {
        giveUpButton.classList.add("disabled");
        giveUpButton.removeEventListener("click", handleGiveUpButton);
    }

    function enableNewGameButton() {
        newGameButton.classList.remove("disabled");
        newGameButton.addEventListener("click", handleNewGameButton);
    }

    function disableNewGameButton() {
        newGameButton.classList.add("disabled");
        newGameButton.removeEventListener("click", handleNewGameButton);
    }

    function endGame(winner) {
        setWinnerMessage(winner);
        stopGridListeners();
        enableNewGameButton();
        disableGiveUpButton();
        clearCookies();
    }

    function handleNewGameButton() {
        removeWinnerMessage();
        resetBoard();
        startGridListeners();
        disableNewGameButton();
        enableGiveUpButton();
    }

    function handleGiveUpButton() {
        validClicksCount++;

        let winner = getNextLetter();
        endGame(winner);
    }

    function resetBoard() {
        clearLetterImages();
        resetDataContents();
        alreadyClickedSquares = new Set();
        validClicksCount = 0;
    }

    function clearLetterImages() {
        let images = document.getElementsByTagName("img");
        for (let i = images.length - 1; i >= 0; i--) {
            let imageElement = images[i];
            imageElement.remove();
        }
    }

    function resetDataContents() {
        let allSquares = document.getElementsByTagName("td");
        for (const square of allSquares) {
            square.setAttribute("data-contents", "empty");
        }
    }

    function restoreLetterFromCookie(letter, element) {
        incrementClickTrackers(element.id);
        setSquareToLetter(letter, element);
    }

    function restoreGame() {
        if (document.cookie) {
            let cookiesArray = document.cookie.split("; ");
            cookiesArray.forEach(cookie => {
                let id = cookie.split("=")[0];
                let letter = cookie.split("=")[1];
                let element = document.getElementById(id);

                restoreLetterFromCookie(letter, element);
            });
        }
    }

    function clearCookies() {
        let cookiesArray = document.cookie.split("; ");
        cookiesArray.forEach(cookie => {
            let key = cookie.split("=")[0];
            document.cookie = key + "=; max-age=0";
        });
    }

    restoreGame();
    startGridListeners();
    enableGiveUpButton();
});


//I don't know how to isolate the clicks so that it doesn't read the border as a square
    //maybe put a clickable div inside that is only the size minus border?