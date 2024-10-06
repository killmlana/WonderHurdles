var errors = 100;
var cardList = [
    "card1",
    "card2"
];

var cardSet;
var board = [];
var rows = 4;
var columns = 3;

var card1Selected;
var card2Selected;
var staticPath = '/static/img/'; 

window.onload = function() {
    shuffleCards();
    startGame();
}

function shuffleCards() {
    cardSet = cardList.concat(cardList); // Two of each card
    // Shuffle
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); // Get random index
        // Swap
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    document.getElementById("board").innerHTML = '';
    let row = [];
    // Arrrange the board
    for (let r = 0; r < rows; r++) {
        
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg);

            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = staticPath + cardImg + ".png"; // Add the static path to the image source
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
    setTimeout(hideCards, 1000); // Adjusted time to ensure images are loaded
}

function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = staticPath + "back.png"; // Add the static path to the back image
        }
    }
}

function selectCard() {
    if (this.src.includes("back")) {
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        let selectedImage = board[r][c];

        if (!card1Selected) {
            card1Selected = this;
            card1Selected.src = staticPath + selectedImage + ".png";
        } else if (!card2Selected && this != card1Selected) {
            card2Selected = this;
            card2Selected.src = staticPath + selectedImage + ".png";
            setTimeout(update, 1000);
        }
    }
}

function update() {
    if (card1Selected.src != card2Selected.src) {
        card1Selected.src = staticPath + "back.png";
        card2Selected.src = staticPath + "back.png";
        errors -= 1;
        document.getElementById("errors").innerText = errors;
    }
    card1Selected = null;
    card2Selected = null;
}
