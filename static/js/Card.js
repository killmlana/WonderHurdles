var cardList = [
    "card1", // First image
    "card2"  // Second image
];

var pairsPerImage = (rows * columns) / cardList.length / 2; // Calculate pairs per image based on rows & columns
var cardSet;
var board = [];
var rows = 4; // Adjust the number of rows
var columns = 3; // Adjust the number of columns

var card1Selected = null;
var card2Selected = null;
var staticPath = '/static/img/';
var errors = 0; // Add an error counter

window.onload = function() {
    generateCardList();
    shuffleCards();
    startGame();
}

function generateCardList() {
    cardSet = [];
    let totalPairs = (rows * columns) / 2;

    // Populate cardSet with an equal number of pairs for each image
    while (cardSet.length < rows * columns) {
        cardList.forEach(card => {
            for (let i = 0; i < totalPairs / cardList.length; i++) {
                cardSet.push(card);
            }
        });
    }
}

function shuffleCards() {
    // Shuffle the cardSet
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); // Get random index
        // Swap
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    document.getElementById("board").innerHTML = ''; // Clear the board
    board = []; // Reset the board array to avoid issues

    // Arrange the board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            if (cardSet.length > 0) {
                let cardImg = cardSet.pop(); // Pop a card image from the shuffled set
                row.push(cardImg);

                // Create card container
                let cardContainer = document.createElement("div");
                cardContainer.classList.add("card-container");

                // Create front and back of card
                let card = document.createElement("div");
                card.classList.add("card");

                let front = document.createElement("div");
                front.classList.add("front");
                front.style.backgroundImage = `url('${staticPath}back.png')`; // Front face (back of the card)

                let back = document.createElement("div");
                back.classList.add("back");
                back.style.backgroundImage = `url('${staticPath}${cardImg}.png')`; // Back face (actual card)

                card.appendChild(front);
                card.appendChild(back);
                cardContainer.appendChild(card);

                cardContainer.id = r.toString() + "-" + c.toString();
                cardContainer.addEventListener("click", selectCard);
                document.getElementById("board").appendChild(cardContainer);
            }
        }
        board.push(row);
    }
    setTimeout(hideCards, 200); // Hide the cards after a short delay
}

function hideCards() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.classList.remove("flipped"); // Ensure cards are hidden
    });
}

function selectCard() {
    if (card1Selected && card2Selected) {
        return; // Do nothing if two cards are already selected
    }

    let cardElement = this.querySelector(".card");

    // Check if card is already flipped
    if (!cardElement.classList.contains("flipped")) {
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        let selectedImage = board[r][c];

        cardElement.classList.add("flipped");

        if (!card1Selected) {
            card1Selected = this;
        } else if (!card2Selected && this !== card1Selected) {
            card2Selected = this;

            setTimeout(update, 400); // Delay to show both cards before flipping back
        }
    }
}

function update() {
    let card1 = card1Selected.querySelector(".back").style.backgroundImage;
    let card2 = card2Selected.querySelector(".back").style.backgroundImage;

    if (card1 !== card2) {
        // Mismatched cards, flip them back
        card1Selected.querySelector(".card").classList.remove("flipped");
        card2Selected.querySelector(".card").classList.remove("flipped");
        errors += 1; // Increment the error counter
        document.getElementById("errors").innerText = errors;
    }

    // Reset selected cards
    card1Selected = null;
    card2Selected = null;
}
