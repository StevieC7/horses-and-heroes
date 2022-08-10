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
// console.log(cardList);

// Define state variables w/o values (leave that for init function)
let score;
const turns = ["Player","CPU"];
let turn;
const phases = ["Setup","Draw","Play","Fight"];
let currentPhase = phases[0];
// console.log("Current phase: " + currentPhase);
let horseDeckCards;
let heroDeckCards;
let cpuDeckCards = [];
let playerHandCards = [];
let cpuHandCards = [];
let playerPlayAreaCards = [];
let cpuPlayAreaCards = [];
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
const renderButton = document.querySelector("#render-button");

// Add functions called by event listeners (use arrow notation)
//add clone function to call when needed for generating new cards in draw functions below
const cloneCards = (original) => {
    const clonedCards = structuredClone(original);
    return clonedCards;
};
const drawHorse = () => {
    // console.log("drawHorse fired.");
    playerHandCards.push(horseDeckCards[0]);
    currentPhase = phases[2];
    // console.log("Current phase: " + currentPhase);
    return;
};
const drawHero = () => {
    // console.log("drawHero fired.");
    if (heroDeckCards.length >= 1) {
        playerHandCards.push(heroDeckCards[0]);
        heroDeckCards.shift();
        currentPhase = phases[2];
        // console.log("Current phase: " + currentPhase);
        return;
    } else {
        alert("You don't have any hero cards to draw.");
    };
};
const inspectCard = (card) => {
    // console.log("inspectCard fired");
    inspectedCard = card;
};
// STRETCH
// const peekCard = (cardIndex) => {
//     console.log("peekCard fired.");
//     peekedCard = cardIndex;
// };
const selectCard = (card) => {
    // console.log("selectCard fired.");
    selectedCard = card;
};
const randomizeHorseDeck = () => {
    let horseDeckClone = [];
    horseDeckClone.push(cloneCards(horse));
    return horseDeckClone;
}
const randomizeHeroDeck = () => {
    // randomize the player's hero deck and return an array of cards
    // TEST VALUE below
    // console.log("randomizeHeroDeck fired.");
    let heroDeckClone = [];
    cardList.forEach((val) => {
        if (val.name !== "Horse") {
            heroDeckClone.push(cloneCards(val));
        };
    });
    // console.log(heroDeckClone);
    return heroDeckClone;
};
const randomizeCpuCards = () => {
    // randomize the CPU's cards and return an array of cards
    // TEST VALUE below
    // console.log("randomizeCpuCards fired.");
    let cpuDeckClone = [];
    cardList.forEach((val) => {cpuDeckClone.push(cloneCards(val))});
    return cpuDeckClone;
};
const playerDrawCards = () => {
    // always draw one horse
    // randomly draw either horses or heroes for the rest of the cards
    // console.log("playerDrawCards fired.");
    // TEST VALUE below
    let tempPlayerDraw = [];
    tempPlayerDraw.push(cloneCards(horseDeckCards[0]));
    tempPlayerDraw.push(cloneCards(heroDeckCards[0]),cloneCards(heroDeckCards[1]),cloneCards(heroDeckCards[2]));
    heroDeckCards.splice(0,3);
    currentPhase = phases[2];
    // console.log("Current phase: " + currentPhase);
    return tempPlayerDraw;
};
const cpuFirstDrawCards = () => {
    // treat cpu the same way as player draw
    // TEST VALUE below
    // console.log("cpuFirstDrawCards fired.");
    let tempCpuDraw = [];
    for (let i = 0; i < cpuDeckCards.length; i++) {
        tempCpuDraw.push(cpuDeckCards[i]);
    }
    currentPhase = phases[2];
    // console.log("Current phase: " + currentPhase);
    return tempCpuDraw;
};
const cpuDrawCards = () => {
    // write function to have cpu draw from its own cloned decks like a human player would
    let cpuHorseDeck = [];
    cpuHorseDeck.push(cloneCards(horse));
    console.log("CPU horse deck on line below");
    cpuHorseDeck.forEach((val) => console.log(val));
    let cpuHeroDeck = [];
    cpuHeroDeck.push(cloneCards(heroDeckCards[0]));
    console.log("CPU hero deck: " + cpuHeroDeck);
    let picker = Math.random();
    if (picker < 0.5) {
        cpuHandCards.push(cpuHorseDeck[0]);
        console.log(cpuHandCards[cpuHandCards.length - 1].name + " added");
    } else if (picker >= 0.5 && cpuHeroDeck.length >= 1){
        cpuHandCards.push(cpuHeroDeck[0]);
        console.log(cpuHeroDeck[0].name + "was the first card in the CPU hero deck");
        console.log(cpuHandCards[cpuHandCards.length - 1].name + " added");
        cpuHeroDeck.shift();
    };
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
    // console.log("End turn button fired.");
    if(turn === turns[0] && currentPhase === phases[2]) {
        currentPhase = phases[3];
        // console.log("Current phase: " + currentPhase);
        turn = turns[1];
        // console.log("Current turn: " + turn);
        return;
    } else if (turn === turns[0] && currentPhase === phases[1]) {
        currentPhase = phases[3];
        // console.log("Current phase: " + currentPhase);
        turn = turns[1];
        // console.log("Current turn: " + turn);
        return;
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
    // console.log("playerHandListener click fired");
    const playerHandChildren = playerHand.children;
    for (let i = 0; i < playerHandChildren.length; i++) {
        playerHandChildren[i].addEventListener("click", () => {
            inspectCard(playerHandCards[i]);
            selectCard(playerHandCards[i]);
        });
        // playerHandChildren[i].addEventListener("mouseover", () => {
        //     peekCard(playerHandCards[i]);
        // });
    };
};
// below event listener ensures the card the user hovers over gets inspected
cpuPlayArea.addEventListener("mouseover", event => {
    // console.log("cpuPlayArea mouseover fired.");
    for (let i = 0; i < cpuPlayArea.children.length; i++) {
        if (event.target !== cpuPlayArea.children[i]) {
            return;
        };
        inspectCard(cpuPlayAreaCards[i]);
    };
});
// need callback function for updating the cpu play area model during render cycle
const cpuPlayAreaListener = () => {
    // for (let i = 0; i < 3; i++) {
        if (turn !== turns[1]) {
            return;
        }
        if (currentPhase !== "Fight") {
            return;
        }
        // TODO - write AI for cpu below
        console.log("CPU play area cards before drawing: " + cpuPlayAreaCards);
        cpuDrawCards();
        if (cpuHandCards.length >= 1) {
            cpuPlayAreaCards.splice(0,1,cpuHandCards[0]);
            console.log("CPU play area cards after drawing and playing from hand: " + cpuPlayAreaCards[0].name);
            cpuHandCards.splice(0,1);
        };
    // }
};
// TODO: refactor playerPlayArea event listeners to apply them individually to the three possible child divs with class "card-slot"
// below event listener ensures the card the user hovers over on the player's board gets inspected
playerPlayArea.addEventListener("mouseover", event => {
    // console.log("playerPlayArea mouseover fired.");
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
            if (selectedCard !== null) {
                // console.log(`playerPlayArea click fired with selected card "${selectedCard.name}".`);
            }
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
                // console.log("playerPlayArea: slot is empty and you're playing a horse.");
                playerPlayAreaCards.splice(i,1,selectedCard);
                playerHandCards.splice(playerHandCards.indexOf(selectedCard),1);
                selectedCard = null;
                return;
            };
            // if card slot is not empty and user has just clicked a horse card from hand, do nothing
            if (playerPlayAreaCards[i] !== null && selectedCard.name === "Horse") {
                // console.log("playerPlayArea: slot not empty and you're trying to play Horse.");
                selectedCard = null;
                return;
            };
            // if card slot has horse card and user has just clicked hero card from hand, play it and remove it from player hand
            if (playerPlayAreaCards[i].name === "Horse" && selectedCard.name !== "Horse") {
                // console.log("playerPlayArea: slot has horse and you're playing a hero.");
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
    return drawHorse();
});
heroDeck.addEventListener("click", () => {
    if (turn !== "Player") {
        return;
    };
    if (currentPhase !== "Draw") {
        return;
    };
    return drawHero();
});
// below functions set up start, reset, and end turn buttons
startButton.addEventListener("click", () => {init()});
resetButton.addEventListener("click", () => {resetGame()});
endTurnButton.addEventListener("click", () => {endTurn()});
endGameButton.addEventListener("click", () => {endGame()});
renderButton.addEventListener("click", () => {render()});

// Invoke init function to initialize state variables
function init() {
    score = 0;
    turn = turns[0];
    currentPhase = phases[1];
    // console.log("Current phase: " + currentPhase);
    horseDeckCards = randomizeHorseDeck();
    heroDeckCards = randomizeHeroDeck();
    cpuDeckCards = randomizeCpuCards();
    playerHandCards = playerDrawCards();
    cpuHandCards = cpuFirstDrawCards();
    playerPlayAreaCards = [null, null, null];
    cpuPlayAreaCards = [null, null, null];
    inspectedCard = null;
    selectedCard = null;
    // cpuPlayAreaListener();
    render();
};
function fight() {
    for (let i = 0; i < 3; i++) {
        // If no opposing card, do damage to score meter.
        if (cpuPlayAreaCards[i] !== null && playerPlayAreaCards[i] === null) {
            console.log("Cpu doing damage. Score going from " + score);
            score -= cpuPlayAreaCards[i].attack;
            console.log("To " + score);
            // return;
        };
        if (playerPlayAreaCards[i] !== null && cpuPlayAreaCards[i] === null) {
            console.log("Player doing damage. Score going from " + score);
            score += playerPlayAreaCards[i].attack;
            console.log("To " + score);
            // return;
        };
        if (playerPlayAreaCards[i] !== null && cpuPlayAreaCards[i] !== null) {
            // Apply attack power of each card to the other. 
            console.log("Your " + playerPlayAreaCards[i].name + " is fighting " + cpuPlayAreaCards[i].name);
            cpuPlayAreaCards[i].health = cpuPlayAreaCards[i].health - playerPlayAreaCards[i].attack;
            playerPlayAreaCards[i].health = playerPlayAreaCards[i].health - cpuPlayAreaCards[i].attack;
        };
        // If health of card <= 0, remove card.
        if (playerPlayAreaCards[i] !== null && playerPlayAreaCards[i].health <= 0) {
            playerPlayAreaCards.splice(playerPlayAreaCards.indexOf(playerPlayAreaCards[i]),1,"remove");
        };
        if (cpuPlayAreaCards[i] !== null && cpuPlayAreaCards[i].health <= 0) {
            cpuPlayAreaCards.splice(cpuPlayAreaCards.indexOf(cpuPlayAreaCards[i]),1,"remove");
        };
    };
    currentPhase = "Draw";
    // console.log("Current phase: " + currentPhase);
    turn = turns[0];
    // console.log("Current turn set by fight during render: " + turn);
    // let postFightRenderDelay = setTimeout(() => render(),5000);
    // function stopTimer() {
    //     clearTimeout(postFightRenderDelay);
    //     postFightRenderDelay = null;
    // }
    // stopTimer();
    render();
    return;
};

// Invoke the main render function (transfer state variables to DOM)
function render() {
    // console.log("render fired");
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
        // console.log("Removing last inspected card");
        cardInspection.removeChild(cardInspection.lastChild);
    };
    if (inspectedCard !== null && inspectedCard !== undefined) {
        // console.log("Inspected card element populated");
        const inspectedCardElement = document.createElement("div");
        inspectedCardElement.classList.add("inspected-card");
        inspectedCardElement.innerHTML = `<img src=\"${inspectedCard.art}\"><p>${inspectedCard.description}</p><div class=\"attack-power\">${inspectedCard.attack}</div><div class=\"card-health\">${inspectedCard.health}</div>`
        cardInspection.append(inspectedCardElement);
    };
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
    // update player play area
    // console.log("Updating play area");
    let playerPlayAreaCardElements = [];
    playerPlayAreaCards.forEach((val,ind) => {
        // console.log("replacing play area cards from array");
        if (val !== null && val !== "remove") {
            const playerPlayAreaCardElement = document.createElement("div");
            playerPlayAreaCardElement.classList.add("card-slot","filled-slot");
            playerPlayAreaCardElement.innerHTML = `<img src=\"${val.art}\"><p>${val.description}</p><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div>`
            playerPlayAreaCardElements.splice(ind,0,playerPlayAreaCardElement);
        };
        if (val === "remove") {
            // playerPlayAreaCards.splice(playerPlayAreaCards.indexOf(val),1);
            // playerPlayAreaCardElements[ind] === null;
            // console.log("Removing child " + ind + " from player play area.");
            // playerPlayArea.children[ind].remove();
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            playerPlayArea.children[ind].replaceWith(replacementChild);
            playerPlayAreaCards[ind] = null;
        };
        if (val === null) {
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            playerPlayAreaCardElements.splice(ind,0,replacementChild);
        };
    });
    for (let i = 0; i < playerPlayAreaCardElements.length; i++) {
        playerPlayArea.children[i].replaceWith(playerPlayAreaCardElements[i]);
    };
    // console.log(playerPlayAreaCardElements);
    playerPlayAreaListener();
    // cpuPlayAreaListener();
    // update cpu play area
    let cpuPlayAreaCardElements = [];
    cpuPlayAreaCards.forEach((val,ind) => {
        console.log("cpu play area render cycle begin (foreach)");
        if (val !== null && val !== "remove") {
            console.log("cpu play area render: val " + val.name + " at index " + ind + " !== null and !== remove")
            const cpuPlayAreaCardElement = document.createElement("div");
            cpuPlayAreaCardElement.classList.add("card-slot","filled-slot");
            cpuPlayAreaCardElement.innerHTML = `<img src=\"${val.art}\"><p>${val.description}</p><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div>`
            cpuPlayAreaCardElements.splice(ind,0,cpuPlayAreaCardElement);
        };
        if (val === "remove") {
            console.log("cpu play area render: val " + val.name + " at index " + ind + " === remove")
            // cpuPlayAreaCards.splice(cpuPlayAreaCards.indexOf(val),1);
            // cpuPlayAreaCardElements[ind] === null;
            // console.log("Removing child " + ind + " from cpu play area.");
            // cpuPlayArea.children[ind].remove();
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            cpuPlayArea.children[ind].replaceWith(replacementChild);
            cpuPlayAreaCards[ind] = null;
        };
        if (val === null) {
            console.log("cpu play area render: val " + val + " at index " + ind + " === null")
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            cpuPlayAreaCardElements.splice(ind,0,replacementChild);
        };
    });
    for (let i = 0; i < cpuPlayAreaCardElements.length; i++) {
        cpuPlayArea.children[i].replaceWith(cpuPlayAreaCardElements[i]);
    };
    // update game log
    // update horse deck
    // STRETCH: update hero deck graphics
    // STRETCH: update cpu hand graphics
    if (currentPhase === "Fight") {
        cpuPlayAreaListener();
        let preFightRenderDelay = setTimeout(() => fight(),5000);
        // fight();
        // render();
    };
    // update score display
    while (scoreMeter.lastChild) {
        scoreMeter.removeChild(scoreMeter.lastChild);
    }
    const scoreMeterDisplay = document.createElement("div");
    scoreMeterDisplay.className = "score-meter";
    scoreMeterDisplay.innerHTML = `${score}`;
    scoreMeter.append(scoreMeterDisplay);
    // console.log(playerPlayAreaCardElements);
};
let intervalID = setInterval(() => render(),500);
function endGame() {
    clearInterval(intervalID);
    intervalID = null;
}

    // Wait for user to trigger event (loop/timer ?)
    
    // Update states based on user action

// Invoke render function again