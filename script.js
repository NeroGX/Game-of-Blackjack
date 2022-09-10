// https://www.deckofcardsapi.com/api/deck/rgwhxr15iv9l/draw/?count=1 Deck of Cards
// Deck ID = rgwhxr15iv9l;
// https://www.deckofcardsapi.com/api/deck/rgwhxr15iv9l/shuffle/

/* Blackjack - receive two cards at start
A - can either be 1 or 11.
K, Q, J- value of 10
Number cards = Value equals number.
Dealer will have two cards and player will have two cards
    -Maybe have a card count
Button that will say hit me or choose to stay
    -If hit me, add a card and check to see if values equal 21 or above
        if it equals 21, game wins
        else if its over 21, player loses
        else, option to hit or say again
    -If stay,
        Dealer will add cards until he reaches a value of 16, either busts, beats the player, or gets 21.
Cards are to remain hidden on the dealer side.
Cards can be revealed on the player side if player hovers over them.

If players hit above 21, but there is an A in his hand, the value of A turns from 11 to 1.
    -Number of aces variable: Count number of aces. If aces are more than 2, one can be 11 while another can be 1.

There will be a play again button
    If game is over, prompt user if they want to start over, and if not, keep same game state.
        -Have a restart button in the HTML just in case.

When dealer draws, place card on field hidden and have img loaded.
    -data.cards[0].image returns image of card.

*/

const mainEl = document.querySelector('main');
const reshuffle = () => {
    fetch("https://www.deckofcardsapi.com/api/deck/rgwhxr15iv9l/shuffle");
};
const playerHandEl = document.getElementById('players-hand');
const dealerHandEl = document.getElementById('dealers-hand');
let points = 100;  // Amount of chips that the player has. Once they reach 200, they win completely.
let numAcesD = 0; // number of Aces currently in dealer hand.
let numAcesP = 0; // number of Aces currently in player hand.
let busted = false; // flag that checks if at any point, a player has busted.
const playerHand = [];  // array to hold the values of the cards in the player's hand.
const dealerHand = [];  // array to hold the values of the cards in the dealer's hand.
let playerScore = 0;
let dealerScore = 0;
const url = 'https://www.deckofcardsapi.com/api/deck/rgwhxr15iv9l/draw/?count=1';
fetch(url)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        playerHandEl.innerHTML +=
        `
            <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
        
        `;
        playerHand.push(data.cards[0].value);
    });

    fetch(url)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        playerHandEl.innerHTML +=
        `
            <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
        
        `;
        playerHand.push(data.cards[0].value);
        playerScore = calculateScore(playerHand, numAcesP);
    });


fetch(url)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        dealerHandEl.classList.add('hidden');
           dealerHandEl.innerHTML += 
           `
           <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
           `;
           dealerHand.push(data.cards[0].value);
    });

fetch(url)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
           dealerHandEl.innerHTML += 
           `
           <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
           `;
           dealerHand.push(data.cards[0].value);
           dealerScore = calculateScore(dealerHand, numAcesD);
    }); 

const hitMeButton = document.getElementById('hit-me');
hitMeButton.addEventListener('click', () => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        playerHandEl.innerHTML +=
        `
            <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
        
        `;
        playerHand.push(data.cards[0].value);
        playerScore = calculateScore(playerHand, numAcesP);
        if (playerScore > 21) {
            alert('Player busted. House takes the win.');
            busted = true;
            points -=50;
            dealerHandEl.classList.remove('hidden')
        }
        if (playerScore === 21) {
            alert('Blackjack motherfucker! I won! Taking my money and going to Vegas!');
            dealerHandEl.classList.remove('hidden');
        }
    });
});

const stayButton = document.getElementById('stay');
stayButton.addEventListener('click', async () => {
    dealerHandEl.classList.remove('hidden');
    while (dealerScore < 16) {
            const res = await fetch(url)
            const data = await res.json();
            //console.log(data);
            dealerHandEl.innerHTML += 
            `
            <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" width=150px height=200px>
            `;
            dealerHand.push(data.cards[0].value);
            dealerScore = calculateScore(dealerHand, numAcesD);
            if (dealerScore > 21) {
                alert('House busted! Congratz, you win!');
                busted = true;
                points += 50;
            }
          
    }
    if (!busted) {
        if (dealerScore === 21) {
            alert('Blackjack motherfucker! House wins! You lose! Good day, sir!');
        }
        else if (dealerScore === playerScore) {
            alert('You broke even!');
        }
        else if (dealerScore < playerScore) {
            alert('Congrats, you beat the house!');
            points += 50; 
        }
        else {
            alert('House wins');
            points -= 50;
        }
}
 });

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
   location.reload();
});

reshuffle();
// console.log(dealerHand);
// console.log(playerHand);

function calculateScore(hand, aceNum) {
    score = 0;
    let bustAce = false;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i] === "ACE") {
            aceNum++;
            bustAce = true;
            if(aceNum > 1) {
                score += 1;
            }
            else {
                score += 11;
            }
        }
        else if(hand[i] === "KING" || hand[i] === "QUEEN" || hand[i] === "JACK") {
            score+= 10;
        }
        else {
            score += parseInt(hand[i]);
        }
    }

   // console.log(score);
    if (score > 21 && bustAce === true)
    {
        score -= 10;
        return score;
    }
    return score;

}
