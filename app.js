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
let currentPhase = phases[0];
let horseDeckCards;
let heroDeckCards;
let cpuDeckCards = ["TEST VALUE"];
let playerHandCards = ["TEST VALUE"];
let cpuHandCards = ["TEST VALUE"];
let playerPlayAreaCards = [];
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
const endGameButton = document.querySelector("#end-game-button");

// Add functions called by event listeners (use arrow notation)
const drawHorse = () => {
    console.log("drawHorse fired.");
    playerHandCards.push(horse);
    currentPhase = phases[2];
};
const drawHero = () => {
    console.log("drawHero fired.");
    playerHandCards.push(heroDeck[0]);
    heroDeckCards.shift();
    currentPhase = phases[2];
};
const inspectCard = (card) => {
    console.log("inspectCard fired");
    inspectedCard = card;
};
// STRETCH
// const peekCard = (cardIndex) => {
//     console.log("peekCard fired.");
//     peekedCard = cardIndex;
// };
const selectCard = (card) => {
    console.log("selectCard fired.");
    selectedCard = card;
};
const randomizeHeroDeck = () => {
    // randomize the player's hero deck and return an array of cards
    // TEST VALUE below
    console.log("randomizeHeroDeck fired.");
    return [horse, gregor,sirstabsalot,gregor,horse];
};
const randomizeCpuCards = () => {
    // randomize the CPU's cards and return an array of cards
    // TEST VALUE below
    console.log("randomizeCpuCards fired.");
    return [horse, gregor,sirstabsalot,gregor,horse];
};
const playerDrawCards = () => {
    // always draw one horse
    // randomly draw either horses or heroes for the rest of the cards
    // TEST VALUE below
    console.log("playerDrawCards fired.");
    currentPhase = phases[2];
    return [horse, gregor,sirstabsalot,gregor,horse];
};
const cpuDrawCards = () => {
    // treat cpu the same way as player draw
    // TEST VALUE below
    console.log("cpuDrawCards fired.");
    currentPhase = phases[2];
    return [horse, gregor,sirstabsalot,gregor,horse];
};
const resetGame = () => {
    // check if user is sure
    prompt("Are you sure? Y/N");
    // if confirmation received, reset the game
    if (prompt.value === "Y") {
        init();
    };
};
const endTurn = () => {
    console.log("End turn button fired.");
    if(turn === turns[0] && currentPhase === phases[2]) {
        currentPhase = phases[3];
    } else if (turn === turn[0] && currentPhase === phases[1]) {
        currentPhase = phases[3];
    };
};

// Add event listeners
// -cards in hand
// -play area
// -decks
// -card inspector
// -start button
// -reset button
// below event listener ensures the hand card the user is hovering over will peek out a bit
// playerHand.addEventListener("mouseover", event => {
//     console.log("playerHand mouseover fired.");
//     for (let i = 0; playerHandCards.length; i++) {
//         if (event.target !== playerHand.children[i]) {
//             return;
//         };
//         peekCard(i);
//     };
// });
// below event listener ensures only the hand card the user is clicking on gets inspected
// playerHand.addEventListener("click", event => {
//     for (let i = 0; i < playerHandCards.length; i++) {
//         if (event.target !== playerHand.children[i]) {
//             return;
//         };
//         inspectCard(playerHandCards[i]);
//         selectCard(playerHandCards[i]);
//     };
// });
const playerHandListener = () => {
    console.log("playerHandListener click fired");
    const playerHandChildren = playerHand.children;
    for (let i = 0; i < playerHandChildren.length; i++) {
        playerHandChildren[i].addEventListener("click", () => {
            inspectCard(playerHandCards[i]);
            selectCard(playerHandCards[i]);
        });
        playerHandChildren[i].addEventListener("mouseover", () => {
            peekCard(playerHandCards[i]);
        });
    };
};
// below event listener ensures the card the user hovers over gets inspected
cpuPlayArea.addEventListener("mouseover", event => {
    console.log("cpuPlayArea mouseover fired.");
    for (let i = 0; i < cpuPlayArea.children.length; i++) {
        if (event.target !== cpuPlayArea.children[i]) {
            return;
        };
        inspectCard(cpuPlayAreaCards[i]);
    };
});
// TODO: refactor playerPlayArea event listeners to apply them individually to the three possible child divs with class "card-slot"
// below event listener ensures the card the user hovers over on the player's board gets inspected
playerPlayArea.addEventListener("mouseover", event => {
    console.log("playerPlayArea mouseover fired.");
    for (let i = 0; i < playerPlayArea.children.length; i++) {
        if (event.target !== playerPlayArea.children[i]) {
            return;
        };
        inspectCard(playerPlayAreaCards[i]);
    };
});
// new event listener for playerPlayArea
const playerPlayAreaListener = () => {
    for (let i = 0; i < playerPlayArea.children.length; i++) {
        playerPlayArea.children[i].addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            console.log(`playerPlayArea click fired with selected card "${selectedCard}".`);
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
            // if card slot is empty and user has just clicked a horse card from hand, play it and remove it from player hand
            if (playerPlayAreaCards[i] === null && selectedCard.name === "Horse") {
                console.log("playerPlayArea: slot is empty and you're playing a horse.");
                playerPlayAreaCards.splice(i,1,selectedCard);
                playerHandCards.splice(playerHandCards.indexOf(selectedCard),1);
                selectedCard = null;
                return;
            };
            // if card slot is not empty and user has just clicked a horse card from hand, do nothing
            if (playerPlayAreaCards[i] !== null && selectedCard.name === "Horse") {
                console.log("playerPlayArea: slot not empty and you're trying to play Horse.");
                selectedCard = null;
                return;
            };
            // if card slot has horse card and user has just clicked hero card from hand, play it and remove it from player hand
            if (playerPlayAreaCards[i].name === "Horse" && selectedCard.name !== "Horse") {
                console.log("playerPlayArea: slot has horse and you're playing a hero.");
                playerPlayAreaCards.splice(i,1,selectedCard);
                playerHandCards.splice(playerHandCards.indexOf(selectedCard),1);
                selectedCard = null;
                return;
            };
            // if card slot is empty and user has just clicked hero card to play, alert player of illegal move
            if (playerPlayAreaCards[i] === null && selectedCard.name !== "Horse") {
                alert("You cannot play heroes directly to the board. You must first play a horse, then replace it with a hero.");
                selectedCard = null;
                return;
            };
        });
    }
    return;
};
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
startButton.addEventListener("click", () => {init()});
resetButton.addEventListener("click", () => {resetGame()});
endTurnButton.addEventListener("click", () => {endTurn()});
endGameButton.addEventListener("click", () => {endGame()});

// Invoke init function to initialize state variables
function init() {
    score = 0;
    turn = turns[0];
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
    render();
};

// Invoke the main render function (transfer state variables to DOM)
function render() {
    console.log("render fired");
    // update start, reset, and end turn buttons based on current phase
    if (currentPhase !== phases[0]) {
        startButton.style.display = "none";
    } else if (currentPhase === phases[0]) {
        startButton.style.display = "inline-block";
        resetButton.style.display = "none";
        endTurnButton.style.display = "none";
    };
    if (currentPhase === phases[2] || currentPhase === phases[1]) {
        endTurnButton.style.display = "inline-block";
    };
    // update score meter with results from fight phase
    // update card inspection to display currently inspected card
    while (cardInspection.lastChild) {
        console.log("Removing last inspected card");
        cardInspection.removeChild(cardInspection.lastChild);
    };
    if (inspectedCard !== null && inspectedCard !== undefined) {
        console.log("Inspected card element populated");
        const inspectedCardElement = document.createElement("div");
        inspectedCardElement.classList.add("inspected-card");
        inspectedCardElement.innerHTML = `<img src=\"${inspectedCard.art}\"><p>${inspectedCard.description}</p><div class=\"attack-power\">${inspectedCard.attack}</div><div class=\"card-health\">${inspectedCard.health}</div>`
        cardInspection.append(inspectedCardElement);
    }
    // update player hand
    while (playerHand.lastChild) {
        playerHand.removeChild(playerHand.lastChild);
    };
    playerHandCards.forEach((val) => {
        const playerHandCardElement = document.createElement("div");
        playerHandCardElement.classList.add("player-hand-card");
        playerHandCardElement.innerHTML = `<img src=\"${val.art}\"><p>${val.description}</p><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div>`
        playerHand.append(playerHandCardElement);
    });
    playerHandListener();
    // STRETCH
    // update peeked card
    // const peekedCardElement = document
    // peekedCardElement.style.margin = "-10px 0px 10px -10px";
    // update play area
    console.log("Updating play area")
    let playerPlayAreaCardElements = [];
    playerPlayAreaCards.forEach((val) => {
        console.log("replacing play area cards from array");
        if (val !== null) {
            const playerPlayAreaCardElement = document.createElement("div");
            playerPlayAreaCardElement.classList.add("card-slot","filled-slot");
            playerPlayAreaCardElement.innerHTML = `<img src=\"${val.art}\"><p>${val.description}</p><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div>`
            playerPlayAreaCardElements.push(playerPlayAreaCardElement);
        };
    });
    for (let i = 0; i < playerPlayAreaCardElements.length; i++) {
        playerPlayArea.children[i].replaceWith(playerPlayAreaCardElements[i]);
    };
    console.log(playerPlayAreaCardElements);
    playerPlayAreaListener();
    // update cpu hand
    // update game log
    // update horse deck
    // update hero deck
};
let intervalID = setInterval(() => render(),500);
const endGame = () => {
    clearInterval(intervalID);
    intervalID = null;
}

// Wait for user to trigger event (loop/timer ?)

// Update states based on user action

// Invoke render function again