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
const sirstabsalot = new Card("Sir Stabsalot",5,2,"He won't tell us where he keeps the knives.","https://placekitten.com/200/300");
sirstabsalot.addToCardList();
const stonewall = new Card("Stonewall",2,5,"Good at standing in the way.","https://placekitten.com/200/300");
stonewall.addToCardList();

let score;
const turns = ["Player","CPU"];
let turn;
const phases = ["Setup","Draw","Play","Fight"];
let currentPhase = phases[0];
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
let gameLogQueue = [null];

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

const cloneCards = (original) => {
    const clonedCards = structuredClone(original);
    return clonedCards;
};
const drawHorse = () => {
    playerHandCards.push(horseDeckCards[0]);
    logEvent(`You drew ${playerHandCards[playerHandCards.length - 1].name}`);
    currentPhase = phases[2];
    logEvent(`Now it's time to ${currentPhase}`);
    return;
};
const drawHero = () => {
    if (heroDeckCards.length >= 1) {
        playerHandCards.push(heroDeckCards[0]);
        logEvent(`You drew ${playerHandCards[playerHandCards.length - 1].name}`);
        heroDeckCards.shift();
        currentPhase = phases[2];
        logEvent(`Now it's time to ${currentPhase}`);
        return;
    } else {
        alert("You don't have any hero cards to draw.");
    };
};
const inspectCard = (card) => {
    inspectedCard = card;
};
// STRETCH
// const peekCard = (cardIndex) => {
//     peekedCard = cardIndex;
// };
const selectCard = (card) => {
    selectedCard = card;
};
const randomizeHorseDeck = () => {
    let horseDeckClone = [];
    horseDeckClone.push(cloneCards(horse));
    return horseDeckClone;
}
const randomizeHeroDeck = () => {
    let heroDeckClone = [];
    cardList.forEach((val) => {
        if (val.name !== "Horse") {
            heroDeckClone.push(cloneCards(val));
        };
    });
    return heroDeckClone;
};
const randomizeCpuCards = () => {
    let cpuDeckClone = [];
    cardList.forEach((val) => {cpuDeckClone.push(cloneCards(val))});
    return cpuDeckClone;
};
const playerDrawCards = () => {
    let tempPlayerDraw = [];
    tempPlayerDraw.push(cloneCards(horseDeckCards[0]));
    tempPlayerDraw.push(cloneCards(heroDeckCards[0]),cloneCards(heroDeckCards[1]),cloneCards(heroDeckCards[2]));
    heroDeckCards.splice(0,3);
    currentPhase = phases[2];
    logEvent(`Now it's time to ${currentPhase}`);
    return tempPlayerDraw;
};
const cpuFirstDrawCards = () => {
    let tempCpuDraw = [];
    for (let i = 0; i < cpuDeckCards.length; i++) {
        tempCpuDraw.push(cpuDeckCards[i]);
    }
    currentPhase = phases[2];
    return tempCpuDraw;
};
const cpuDrawCards = () => {
    let cpuHorseDeck = [];
    cpuHorseDeck.push(cloneCards(horse));
    let cpuHeroDeck = [];
    cpuHeroDeck.push(cloneCards(heroDeckCards[0]));
    let picker = Math.random();
    if (picker < 0.5) {
        cpuHandCards.push(cpuHorseDeck[0]);
    } else if (picker >= 0.5 && cpuHeroDeck.length >= 1){
        cpuHandCards.push(cpuHeroDeck[0]);
        cpuHeroDeck.shift();
    };
};
const resetGame = () => {
    location.reload();
};
const endTurn = () => {
    if(turn === turns[0] && currentPhase === phases[2]) {
        currentPhase = phases[3];
        logEvent(`Now it's time to ${currentPhase}`);
        turn = turns[1];
        logEvent(`Turn: ${turn}`);
        cpuAI();
        return;
    } else if (turn === turns[0] && currentPhase === phases[1]) {
        currentPhase = phases[3];
        logEvent(`Now it's time to ${currentPhase}`);
        turn = turns[1];
        logEvent(`Turn: ${turn}`);
        cpuAI();
        return;
    };
};
const playerHandListener = () => {
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
const cpuPlayAreaListener = () => {
    const cpuPlayAreaChildren = cpuPlayArea.children;
    for (let i = 0; i < cpuPlayAreaChildren.length; i++) {
        cpuPlayAreaChildren[i].addEventListener("click", () => {
            inspectCard(cpuPlayAreaCards[i]);
        })
    }
}
cpuPlayArea.addEventListener("mouseover", event => {
    for (let i = 0; i < cpuPlayArea.children.length; i++) {
        if (event.target !== cpuPlayArea.children[i]) {
            return;
        };
        inspectCard(cpuPlayAreaCards[i]);
    };
});
const cpuAI = () => {
    console.log("cpuAI is running");
    if (turn !== turns[1]) {
        return;
    }
    if (currentPhase !== "Fight") {
        return;
    }
    console.log("AI logic running.")
    cpuDrawCards();
    console.log("CPU drew a card. CPU now has " + cpuHandCards.length + " cards.");
    let cpuHandHorses = [];
    for (let i = 0; i < cpuHandCards.length; i++) {
        if (cpuHandCards[i].name === "Horse") {
            cpuHandHorses.push(i);
        };
    };
    console.log(cpuHandHorses);
    let openSlots = [];
    if (cpuHandHorses.length >= 1) {
        for (let i = 0; i < cpuPlayAreaCards.length;i++) {
            if (cpuPlayAreaCards[i] === null) {
                openSlots.push(i);
            };
        };
    };
    console.log(openSlots);
    let horsePlayIterator = 0;
    while (horsePlayIterator < cpuHandHorses.length && horsePlayIterator < openSlots.length) {
        console.log("horseplay while loop running on cpuPlayArea " + openSlots[horsePlayIterator] + " and inserting " + cpuHandCards[cpuHandHorses[horsePlayIterator]]);
        cpuPlayAreaCards.splice(openSlots[horsePlayIterator],1,cloneCards(cpuHandCards[cpuHandHorses[horsePlayIterator]]));
        console.log("CPU playing " + cpuHandCards[cpuHandHorses[horsePlayIterator]].name);
        horsePlayIterator++;
    };
    for (let i = 0; i < cpuHandHorses.length; i++) {
        console.log("Removing horse at " + cpuHandHorses[i] + " from hand.");
        cpuHandCards.splice(cpuHandHorses[i],1);
    };
    let cpuHandHeroes = [];
    for (let i = 0; i < cpuHandCards.length; i++) {
        cpuHandHeroes.push(i);
        console.log("CPU found hero at " + cpuHandHeroes[i]);
    };
    cpuHandHeroes.sort((a,b) => a.attack - b.attack);
    for (let i = 0; i < cpuPlayAreaCards.length;i++) {
        console.log("CPU looking for horse to play hero on");
        if (cpuPlayAreaCards[i] !== null && cpuPlayAreaCards[i].name === "Horse") {
            cpuPlayAreaCards.splice(i,1,cloneCards(cpuHandCards[i]));
            console.log("CPU hand cards before playing" + cpuHandCards);
            console.log("CPU played " + cpuHandCards[i].name);
            cpuHandCards.splice(cpuHandCards.indexOf(cpuHandHeroes[i]),1);
            console.log("CPU hand cards after playing" + cpuHandCards);
            console.log("CPU removed card " + cpuHandCards[cpuHandHeroes[i]].name + " at " + cpuHandHeroes[i]);
        };
    };
    console.log("CPU now has " + cpuHandCards.length + " cards.");
};
const playerPlayAreaListener = () => {
    const playerPlayAreaChildren = playerPlayArea.children;
    for (let i = 0; i < playerPlayAreaChildren.length; i++) {
        playerPlayAreaChildren[i].addEventListener("mouseover", () => {
            inspectCard(playerPlayAreaCards[i]);
        });
        playerPlayAreaChildren[i].addEventListener("click", (e) => {
            e.stopImmediatePropagation();
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
                playerPlayAreaCards.splice(i,1,cloneCards(selectedCard));
                playerHandCards.splice(playerHandCards.indexOf(selectedCard),1);
                selectedCard = null;
                return;
            };
            // if card slot is not empty and user has just clicked a horse card from hand, do nothing
            if (playerPlayAreaCards[i] !== null && selectedCard.name === "Horse") {
                selectedCard = null;
                return;
            };
            // if card slot has horse card and user has just clicked hero card from hand, play it and remove it from player hand
            if (playerPlayAreaCards[i].name === "Horse" && selectedCard.name !== "Horse") {
                playerPlayAreaCards.splice(i,1,cloneCards(selectedCard));
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
startButton.addEventListener("click", () => {init()});
resetButton.addEventListener("click", () => {resetGame()});
endTurnButton.addEventListener("click", () => {endTurn()});
endGameButton.addEventListener("click", () => {endGame()});

function init() {
    score = 0;
    turn = turns[0];
    currentPhase = phases[1];
    horseDeckCards = randomizeHorseDeck();
    heroDeckCards = randomizeHeroDeck();
    cpuDeckCards = randomizeCpuCards();
    playerHandCards = playerDrawCards();
    cpuHandCards = cpuFirstDrawCards();
    playerPlayAreaCards = [null, null, null];
    cpuPlayAreaCards = [null, null, null];
    inspectedCard = null;
    selectedCard = null;
    render();
};
const logEvent = (message) => {
    const gameLogDisplay = document.createElement("p");
    gameLogDisplay.classList = "game-log-display";
    gameLogDisplay.style.marginBottom = `${gameLog.clientHeight -180}px`;
    gameLogDisplay.innerHTML = message;
    gameLogQueue.push(gameLogDisplay);
    return;
}

function fight() {
    if (currentPhase !== "Fight") {
        return;
    }
        for (let i = 0; i < 3; i++) {
            // If no opposing card, do damage to score meter.
            if (cpuPlayAreaCards[i] !== null && playerPlayAreaCards[i] === null) {
                score -= cpuPlayAreaCards[i].attack;
                logEvent(`CPU's ${cpuPlayAreaCards[i].name} dealt you ${cpuPlayAreaCards[i].attack} damage.`);
            };
            if (playerPlayAreaCards[i] !== null && cpuPlayAreaCards[i] === null) {
                score += playerPlayAreaCards[i].attack;
                logEvent(`Your ${playerPlayAreaCards[i].name} dealt the CPU ${playerPlayAreaCards[i].attack} damage.`);
            };
            if (playerPlayAreaCards[i] !== null && cpuPlayAreaCards[i] !== null) {
                cpuPlayAreaCards[i].health = cpuPlayAreaCards[i].health - playerPlayAreaCards[i].attack;
                logEvent(`Your ${playerPlayAreaCards[i].name} damaged CPU's ${cpuPlayAreaCards[i].name} for ${playerPlayAreaCards[i].attack}`);
                playerPlayAreaCards[i].health = playerPlayAreaCards[i].health - cpuPlayAreaCards[i].attack;
                logEvent(`CPU's ${cpuPlayAreaCards[i].name} damaged your ${playerPlayAreaCards[i].name} for ${cpuPlayAreaCards[i].attack}`);
            };
            if (playerPlayAreaCards[i] !== null && playerPlayAreaCards[i].health <= 0) {
                playerPlayAreaCards.splice(playerPlayAreaCards.indexOf(playerPlayAreaCards[i]),1,"remove");
            };
            if (cpuPlayAreaCards[i] !== null && cpuPlayAreaCards[i].health <= 0) {
                cpuPlayAreaCards.splice(cpuPlayAreaCards.indexOf(cpuPlayAreaCards[i]),1,"remove");
            };
        };
    turn = turns[0];
    currentPhase = "Draw";
    setTimeout(() => {
        logEvent(`Turn: ${turn}`);
        logEvent(`Now it's time to ${currentPhase}`);
    },200);
    render();
    return;
};

function render() {
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
    while (cardInspection.lastChild) {
        cardInspection.removeChild(cardInspection.lastChild);
    };
    if (inspectedCard !== null && inspectedCard !== undefined) {
        const inspectedCardElement = document.createElement("div");
        inspectedCardElement.classList.add("inspected-card");
        inspectedCardElement.style.backgroundImage = `url(${inspectedCard.art})`;
        inspectedCardElement.innerHTML = `<p>${inspectedCard.name}</p><p>${inspectedCard.description}</p><div class=\"attack-power\">${inspectedCard.attack}</div><div class=\"card-health\">${inspectedCard.health}</div>`
        cardInspection.append(inspectedCardElement);
    };
    while (playerHand.lastChild) {
        playerHand.removeChild(playerHand.lastChild);
    };
    playerHandCards.forEach((val) => {
        const playerHandCardElement = document.createElement("div");
        playerHandCardElement.classList.add("player-hand-card");
        playerHandCardElement.style.backgroundImage = `url(${val.art})`;
        playerHandCardElement.innerHTML = `<p>${val.name}</p><p>${val.description}</p><div class="card-stats"><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div></div>`
        playerHand.append(playerHandCardElement);
    });
    playerHandListener();
    // STRETCH
    // update peeked card
    // const peekedCardElement = document
    // peekedCardElement.style.margin = "-10px 0px 10px -10px";
    let playerPlayAreaCardElements = [];
    playerPlayAreaCards.forEach((val,ind) => {
        if (val !== null && val !== "remove") {
            const playerPlayAreaCardElement = document.createElement("div");
            playerPlayAreaCardElement.classList.add("card-slot","filled-slot");
            playerPlayAreaCardElement.style.backgroundImage = `url(${val.art})`;
            playerPlayAreaCardElement.innerHTML = `<p>${val.name}</p><div class="card-stats"><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div></div>`
            playerPlayAreaCardElements.splice(ind,0,playerPlayAreaCardElement);
        };
        if (val === "remove") {
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
    playerPlayAreaListener();
    let cpuPlayAreaCardElements = [];
    cpuPlayAreaCards.forEach((val,ind) => {
        if (val !== null && val !== "remove") {
            const cpuPlayAreaCardElement = document.createElement("div");
            cpuPlayAreaCardElement.classList.add("card-slot","filled-slot");
            cpuPlayAreaCardElement.style.backgroundImage = `url(${val.art})`;
            cpuPlayAreaCardElement.innerHTML = `<p>${val.name}</p><div class=\"attack-power\">${val.attack}</div><div class=\"card-health\">${val.health}</div>`;
            cpuPlayAreaCardElements.splice(ind,0,cpuPlayAreaCardElement);
        };
        if (val === "remove") {
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            cpuPlayArea.children[ind].replaceWith(replacementChild);
            cpuPlayAreaCards[ind] = null;
        };
        if (val === null) {
            const replacementChild = document.createElement("div");
            replacementChild.className = "card-slot";
            replacementChild.innerHTML = "Empty";
            cpuPlayAreaCardElements.splice(ind,0,replacementChild);
        };
    });
    for (let i = 0; i < cpuPlayAreaCardElements.length; i++) {
        cpuPlayArea.children[i].replaceWith(cpuPlayAreaCardElements[i]);
    };
    cpuPlayAreaListener();
    // STRETCH: update hero deck graphics
    // STRETCH: update cpu hand graphics
    if (currentPhase === "Fight") {
        const fightDelay = (ms) => new Promise(resolve => setTimeout(resolve,ms));
        fightDelay(3000).then(() => fight());
    };
    while (scoreMeter.children.length > 1) {
        scoreMeter.removeChild(scoreMeter.lastChild);
    };
    const scoreMeterDisplay = document.createElement("div");
    scoreMeterDisplay.className = "score-meter";
    scoreMeterDisplay.innerHTML = `${score}`;
    scoreMeter.appendChild(scoreMeterDisplay);
    for (let i = 0; i < gameLogQueue.length; i++) {
        if (gameLogQueue[i] !== null) {
            gameLog.append(gameLogQueue[i]);
        };
        gameLogQueue.splice(i,1);
    };
    gameLog.scrollTo(0, gameLog.scrollHeight);
    setTimeout(() => {
        if (score < -4) {
            endGame();
            const gameOverLose = document.createElement("div");
            gameOverLose.classList = "game-over";
            gameOverLose.innerHTML = `You Lose<br><button id="reset-button">Play Again</button>`;
            while (document.body.lastElementChild) {
                document.body.removeChild(document.body.lastElementChild);
            };
            document.body.appendChild(gameOverLose);
            const resetButton = document.querySelector("#reset-button");
            resetButton.addEventListener("click", () => {resetGame()});
        };
        if (score > 4) {
            endGame();
            const gameOverWin = document.createElement("div");
            gameOverWin.classList = "game-over";
            gameOverWin.innerHTML = `You Win<br><button id="reset-button">Play Again</button>`;
            while (document.body.lastElementChild) {
                document.body.removeChild(document.body.lastElementChild);
            };
            document.body.appendChild(gameOverWin);
            const resetButton = document.querySelector("#reset-button");
            resetButton.addEventListener("click", () => {resetGame()});
        };
    },500);
};
let renderCycle = setInterval(() => requestAnimationFrame(render),1000);
function endGame() {
    clearInterval(renderCycle);
    renderCycle = null;
}