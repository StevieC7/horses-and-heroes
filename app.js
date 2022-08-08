/* 
WIN CONDITION
-If the score meter maxes out at 5 on a player's side, that player loses.
GAME FLOW
1. Decks shuffled and set for play
2. Players draw their hands
3. Play phase
    -(expect first turn) Player draws either a horse or a hero card. The horse deck is an unlimited supply.
    -Player may play as many cards in one turn as there are available spots on their side of the board.
    -Player may play a horse into an empty spot. Horses are weak, but necessary to play heroes.
    -Player may play a hero onto a horse, but not onto an empty spot. If played onto horse, the mounted horse is removed from play.
4. Fight phase
    -Player's cards are compared against CPU's, one by one
    -The cards' attack powers reduce their opposing card's health
    -If a card loses all health, it is discarded
    -If a card opposes an empty spot, its attack power is applied against the player/cpu score meter
    -If a card's attack causes either player's score to cross the "loss" threshold, that player loses.
5. Repeat play phase and fight phase until a player loses.
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
}

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
// -score
// -deck arrays (consist of card objects)
// -player hand array
// -cpu hand array
// -play area array (what cards are in play and where, how much health they have, any other modifiers)
let score;
let horseDeckCards = ["TEST VALUE"];
let heroDeckCards = ["TEST VALUE"];
let playerDeckCards = ["TEST VALUE"];
let cpuDeckCards = ["TEST VALUE"];
let playerHandCards = ["TEST VALUE"];
let cpuHandCards = ["TEST VALUE"];
let playAreaCards = ["TEST VALUE"]; // this should include array of arrays where index [0] of each inner array is the position of the card on the field and index[1] is the card object
let selectedCard;

// Select HTML elements that will be used more than once
// -play area (cpu and player)
// -hands (cpu and player)
// -cards
// -decks
// -score meter
// -game log
const playArea = document.querySelector("#play-area");
const cpuPlayArea = document.querySelector("#cpu-play-area");
const playerPlayArea = document.querySelector("#player-play-area");
const playerHand = document.querySelector("#player-hand");
const cpuHand = document.querySelector("#cpu-hand");
const horseDeck = document.querySelector("#horse-deck");
const heroDeck = document.querySelector("#hero-deck");
const scoreMeter = document.querySelector("#score");
const gameLog = document.querySelector("#game-log");
// Add event listeners
// -cards in hand
// -play area
// -decks
// -card inspector
// below event listener ensures the hand card the user is hovering over will peek out a bit
playerHand.addEventListener("mouseover", event => {
    for (let i = 0; playerHandCards.length; i++) {
        if (event.target !== playerHand.children[i]) {
            return;
        }
        peekCard();
    }
})
// below event listener ensures only the hand card the user is clicking on gets inspected
playerHand.addEventListener("click", event => {
    for (let i = 0; i < playerHandCards.length; i++) {
        if (event.target !== playerHand.children[i]) {
            return;
        }
        inspectCard();
        selectCard();
    }
});
// below event listener ensures the card the user hovers over gets inspected
cpuPlayArea.addEventListener("mouseover", event => {
    for (let i = 0; i < cpuPlayArea.children.length; i++) {
        if (event.target !== cpuPlayArea.children[i]) {
            return;
        }
        inspectCard();
    }
});
// below event listener ensures the card the user hovers over on the player's board gets inspected
playerPlayArea.addEventListener("mouseover", event => {
    for (let i = 0; i < playerPlayArea.children.length; i++) {
        if (event.target !== playerPlayArea.children[i]) {
            return;
        }
        inspectCard();
    }
})
// below event listener handles possibilities for the player's card slots
playerPlayArea.addEventListener("click", event => {
    // if not user's turn, do nothing
    // if user has not just clicked a card from hand, do nothing
    // if card slot is not empty and user has just clicked a horse card from hand, do nothing
    // if card slot has horse card and user has just clicked hero card from hand, play it
    // if card slot is empty and user has just clicked a horse card from hand, play it
    // if card slot is empty and user has just clicked hero card to play, alert player of illegal move
})

horseDeck.addEventListener("click",drawHorse());
heroDeck.addEventListener("click",drawHero());

// Invoke init function to initialize state variables

// Invoke the main render function (transfer state variables to DOM)

// Wait for user to trigger event (loop/timer ?)

// Update states based on user action

// Invoke render function again