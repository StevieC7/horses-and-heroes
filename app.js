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


// Define state variables w/o values (leave that for init function)
// -score
// -deck arrays (consist of card objects)
// -player hand array
// -cpu hand array
// -individual card healths for cards in play (should default to original card object values in the constants)

// Select HTML elements that will be used more than once
// -play area
// -hands (cpu and player)
// -cards
// -decks
// -score meter
// -game log

// Add event listeners
// -cards in hand
// -play area
// -decks
// -card inspector

// Invoke init function to initialize state variables

// Invoke the main render function (transfer state variables to DOM)

// Wait for user to trigger event (loop/timer ?)

// Update states based on user action

// Invoke render function again