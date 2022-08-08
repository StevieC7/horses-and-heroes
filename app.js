/* 
WIN CONDITION
-If the score meter maxes out at 5 on a player's side, that player loses.
GAME FLOW
0. Decks shuffled and set for play
1. Players draw their hands
2. Play phase
    -(expect first turn) Player draws either a horse or a hero card. The horse deck is an unlimited supply.
    -Player may play as many cards in one turn as there are available spots on their side of the board.
    -Player may play a horse into an empty spot. Horses are weak, but necessary to play heroes.
    -Player may play a hero onto a horse, but not onto an empty spot. If played onto horse, the mounted horse is removed from play.
3. Fight phase
    -Player's cards are compared against CPU's, one by one
    -The cards' attack powers reduce their opposing card's health
    -If a card loses all health, it is discarded
    -If a card opposes an empty spot, its attack power is applied against the player/cpu score meter
    -If a card's attack causes either player's score to cross the "loss" threshold, that player loses.
4. Repeat play phase and fight phase until a player loses.
*/

// Define constants
// -card objects
let cardList = [];
class Card {
    constructor(name, attack, health, description, art) {
        this.name = name;
        this.attack = attack;
        this.health = health;
        this.description = description;
        this.art = art;
    }
    addToCardList () {
        cardList.push(this);
    }
};
const horse = new Card("Horse",1,1,"Just a regular horse.","https://placekitten.com/200/300");
horse.addToCardList();
const gregor = new Card("Gregor",2,2,"Slightly better than a horse.","https://placekitten.com/200/300");
gregor.addToCardList();
const aaron = new Card("Aaron",3,3,"It's pronounced A-A-ron!","https://placekitten.com/200/300");
aaron.addToCardList();
const stinker = new Card("Stinker",1,3,"He's a little stinker, ain't he?","https://placekitten.com/200/300");
stinker.addToCardList();
const sirstabsalot = new Card("Sir Stabsalot",5,2,"The third spear is a bit excessive.","https://placekitten.com/200/300");
sirstabsalot.addToCardList();
const stonewall = new Card("Stonewall",2,5,"Good at standing in the way.","https://placekitten.com/200/300");
stonewall.addToCardList();
console.log(cardList);

// Define state variables w/o values (leave that for init function)
let score;
const turns = ["Player","CPU"];
let turn;
const phases = ["Setup","Draw","Play","Fight"];
let currentPhase;
let horseDeckCards;
let heroDeckCards;
let cpuDeckCards = ["TEST VALUE"];
let playerHandCards = ["TEST VALUE"];
let cpuHandCards = ["TEST VALUE"];
let playerPlayAreaCards = ["TEST VALUE"];
let cpuPlayAreaCards = ["TEST VALUE"];
let inspectedCard;
let peekedCard;
let selectedCard;

// Select HTML elements that will be used more than once
const playArea = document.querySelector("#play-area");
const cpuPlayArea = document.querySelector("#cpu-play-area");
const playerPlayArea = document.querySelector("#player-play-area");
const playerHand = document.querySelector("#player-hand");
const cardInspection = document.querySelector("#card-inspection");
const cpuHand = document.querySelector("#cpu-hand");
const horseDeck = document.querySelector("#horse-deck");
const heroDeck = document.querySelector("#hero-deck");
const scoreMeter = document.querySelector("#score");
const gameLog = document.querySelector("#game-log");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const endTurnButton = document.querySelector("#end-turn-button");

// Add functions called by event listeners (use arrow notation)
const drawHorse = () => {
    playerHandCards.push(horse);
    currentPhase = phases[2];
};
const drawHero = () => {
    playerHandCards.push(heroDeck[0]);
    heroDeckCards.shift();
    currentPhase = phases[2];
};
const inspectCard = (card) => {
    inspectedCard = card;
};
const peekCard = (cardIndex) => {
    peekedCard = cardIndex;
};
const selectCard = (card) => {
    selectedCard = card;
};
const randomizeHeroDeck = () => {
    // randomize the player's hero deck and return an array of cards
    // TEST VALUE below
    return [horse, gregor,sirstabsalot,gregor,horse];
}
const randomizeCpuCards = () => {
    // randomize the CPU's cards and return an array of cards
    // TEST VALUE below
    return [horse, gregor,sirstabsalot,gregor,horse];
}
const playerDrawCards = () => {
    // always draw one horse
    // randomly draw either horses or heroes for the rest of the cards
    // TEST VALUE below
    return [horse, gregor,sirstabsalot,gregor,horse];
}
const cpuDrawCards = () => {
    // treat cpu the same way as player draw
    // TEST VALUE below
    return [horse, gregor,sirstabsalot,gregor,horse];
}
const resetGame = () => {
    // check if user is sure
    prompt("Are you sure?");
    // if confirmation received, reset the game
    if (prompt.value === "Y") {
        init();
    };
}
const endTurn = () => {
    currentPhase = phases[3];
}

// Add event listeners
// -cards in hand
// -play area
// -decks
// -card inspector
// -start button
// -reset button
// below event listener ensures the hand card the user is hovering over will peek out a bit
playerHand.addEventListener("mouseover", event => {
    for (let i = 0; playerHandCards.length; i++) {
        if (event.target !== playerHand.children[i]) {
            return;
        };
        peekCard(i);
    };
});
// below event listener ensures only the hand card the user is clicking on gets inspected
playerHand.addEventListener("click", event => {
    for (let i = 0; i < playerHandCards.length; i++) {
        if (event.target !== playerHand.children[i]) {
            return;
        };
        inspectCard(playerHandCards[i]);
        selectCard(playerHandCards[i]);
    };
});
// below event listener ensures the card the user hovers over gets inspected
cpuPlayArea.addEventListener("mouseover", event => {
    for (let i = 0; i < cpuPlayArea.children.length; i++) {
        if (event.target !== cpuPlayArea.children[i]) {
            return;
        };
        inspectCard(cpuPlayAreaCards[i]);
    };
});
// below event listener ensures the card the user hovers over on the player's board gets inspected
playerPlayArea.addEventListener("mouseover", event => {
    for (let i = 0; i < playerPlayArea.children.length; i++) {
        if (event.target !== playerPlayArea.children[i]) {
            return;
        };
        inspectCard(playerPlayAreaCards[i]);
    };
});
// below event listener handles possibilities for the player's card slots
playerPlayArea.addEventListener("click", event => {
    // if not user's turn, do nothing
    if (turn !== "Player") {
        return;
    };
    // if not play phase, do nothing
    if (currentPhase !== "Play") {
        return;
    };
    // if user has not just clicked a card from hand, do nothing
    if (selectedCard === null) {
        return;
    };
    for (let i = 0; i < playerPlayAreaCards.length; i++) {
        if (event.target !== playerPlayArea.children[i]) {
            return;
        };
        // if card slot is not empty and user has just clicked a horse card from hand, do nothing
        if (playerPlayAreaCards[i] !== null && selectedCard.name === "Horse") {
            return;
        };
        // if card slot has horse card and user has just clicked hero card from hand, play it and remove it from player hand
        if (playerPlayAreaCards[i].name === "Horse" && selectedCard.name !== "Horse") {
            playerPlayAreaCards.splice(i,1,selectedCard);
            playerHandCards.splice(playerHandCards[i],1);
            return;
        };
        // if card slot is empty and user has just clicked a horse card from hand, play it play it and remove it from player hand
        if (playerPlayAreaCards[i] === null && selectedCard.name === "Horse") {
            playerPlayAreaCards.splice(i,1,selectedCard);
            playerHandCards.splice(playerHandCards[i],1);
            return;
        }
        // if card slot is empty and user has just clicked hero card to play, alert player of illegal move
        if (playerPlayAreaCards[i] === null && selectedCard.name !== "Horse") {
            alert("You cannot play heroes directly to the board. You must first play a horse, then replace it with a hero.");
        };
    };
});
// below events ensure user can draw during draw phase
horseDeck.addEventListener("click", () => {
    if (turn !== "Player") {
        return;
    };
    if (currentPhase !== "Draw") {
        return;
    };
    drawHorse();
});
heroDeck.addEventListener("click", () => {
    if (turn !== "Player") {
        return;
    };
    if (currentPhase !== "Draw") {
        return;
    };
    drawHero();
});
// below functions set up start, reset, and end turn buttons
startButton.addEventListener("click", init());
resetButton.addEventListener("click", resetGame());
endTurnButton.addEventListener("click", endTurn());

// Invoke init function to initialize state variables
function init() {
    score = 0;
    turn = turn[0];
    currentPhase = phases[1];
    horseDeckCards = [horse];
    heroDeckCards = randomizeHeroDeck();
    cpuDeckCards = randomizeCpuCards();
    playerHandCards = playerDrawCards();
    cpuHandCards = cpuDrawCards();
    playerPlayAreaCards = [null, null, null];
    cpuPlayAreaCards = [null, null, null];
    inspectedCard = null;
    selectedCard = null;
};

// Invoke the main render function (transfer state variables to DOM)

// Wait for user to trigger event (loop/timer ?)

// Update states based on user action

// Invoke render function again