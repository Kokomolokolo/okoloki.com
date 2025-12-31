// Variablen maybe aufräumen oder so
let stapelPlayer = null;
let stapelDealer = null;
let trackerDealer = "in";
let trackerPlayer = "in";

let askForDescision = false
let currentDescision = null

let gameover = true
let currentTurn = "player"

let drawnCardDealer = []
let drawnCardPlayer = []

const playerPacket = []
document.getElementById('controll').style.visibility = 'hidden'
let xyz = 0

let animationIsRunning = false

document.getElementById('movingCard').style.visibility = 'hidden'

// Array of card types with values
const cardTypes = [
    { kindOfCard: "two", value: 2 },
    { kindOfCard: "three", value: 3 },
    { kindOfCard: "four", value: 4 },
    { kindOfCard: "five", value: 5 },
    { kindOfCard: "six", value: 6 },
    { kindOfCard: "seven", value: 7 },
    { kindOfCard: "eight", value: 8 },
    { kindOfCard: "nine", value: 9 },
    { kindOfCard: "ten", value: 10 },
    { kindOfCard: "jack", value: 10 },
    { kindOfCard: "queen", value: 10 },
    { kindOfCard: "king", value: 10 },
    { kindOfCard: "ace", value1: 1, value: 11 }
];
const suits = ["hearts", "diamonds", "spades", "clubs"];

// Initialize the deck with cards and suits
let cardStapel = [];

// Karten mit allen möglichen Farben erstellen
suits.forEach(suit => {
    cardTypes.forEach(card => {
        cardStapel.push({ ...card, suit: suit, cardName: `${suit}_${card.kindOfCard}` });
    });
});

function drawACard() {
    let drawnCard = cardStapel[Math.floor(Math.random() * cardStapel.length)];
    return drawnCard;
}

function combinedValue(array) {
    let aceCount = 0;
    let totalValue = array.reduce((sum, card) => {
        if (card.kindOfCard === "ace") {
            aceCount++;
            return sum + 11; // Ass erstmal als 11 
        }
        return sum + card.value;
    }, 0);
    while (totalValue > 21 && aceCount > 0) {
        totalValue -= 10;
        aceCount--;
    }
    return totalValue;
}

function checkWinner() {
    const playerValue = combinedValue(drawnCardPlayer);
    const dealerValue = combinedValue(drawnCardDealer);

    // Überprüfe, ob der Spieler Bust hat
    if (playerValue > 21) {
        gameover = true;
        // document.getElementById('gameResult').innerText = "Player Busts! Dealer Wins.";
        console.log("Player Busts! Dealer gewinnt.");
        return;
    }
    
    // Überprüfe, ob der Dealer Bust hat
    if (dealerValue > 21) {
        gameover = true;
        // document.getElementById('gameResult').innerText = "Dealer Busts! Player Wins.";
        console.log("Dealer Busts! Player gewinnt.");
        return;
    }

    // Überprüfe, ob der Spieler Blackjack hat (21 Punkte)
    if (playerValue == 21) {
        gameover = true;
        // document.getElementById('gameResult').innerText = "Player has Blackjack! Player Wins.";
        console.log("Player hat Blackjack! Player gewinnt.");
        return;
    }

    // Überprüfe, ob der Dealer Blackjack hat (21 Punkte)
    if (dealerValue == 21) {
        gameover = true;
        // document.getElementById('gameResult').innerText = "Dealer has Blackjack! Dealer Wins.";
        console.log("Dealer hat Blackjack! Dealer gewinnt.");
        return;
    }

    // Vergleiche die Punktzahlen der Spieler und des Dealers
    if (playerValue > dealerValue) {
        gameover = true;
        // document.getElementById('gameResult').innerText = `Player Wins with ${playerValue} vs Dealer's ${dealerValue}.`;
        console.log(`Player gewinnt mit ${playerValue} gegen Dealer's ${dealerValue}.`);
    } else if (dealerValue > playerValue) {
        gameover = true;
        // document.getElementById('gameResult').innerText = `Dealer Wins with ${dealerValue} vs Player's ${playerValue}.`;
        console.log(`Dealer gewinnt mit ${dealerValue} gegen Player's ${playerValue}.`);
    } else {
        gameover = true;
        // document.getElementById('gameResult').innerText = "It's a tie!";
        console.log("Unentschieden!");
    }
}

// Functions for HTML interactions:
function updateGamestate(){
    // textPlayer = `The player drew ${drawnCardPlayer[0].kindOfCard} of ${drawnCardPlayer[0].suit}, so ${combinedValue(drawnCardPlayer)}`
    // textDealer = `Dealer drew a ${drawnCardDealer[0].kindOfCard} of ${drawnCardDealer[0].suit}, so ${combinedValue(drawnCardDealer)}` 
    // document.getElementById("playerStatus").innerHTML = textPlayer
    // document.getElementById("dealerStatus").innerHTML = textDealer

    counterPlayer = `${combinedValue(drawnCardPlayer)} / 21`
    document.getElementById("playerCounter").innerHTML = counterPlayer

    counterDealer = `${combinedValue(drawnCardDealer)} / 21`
    document.getElementById("dealerCounter").innerHTML = counterDealer
    updatePlayerHand()
    updateDealerHand()
}

function updatePlayerHand() {
    const handOfPlayer = document.getElementById('playerCarsID');
    handOfPlayer.innerHTML = ''; // Vorherige Karten entfernen
    
    const cardWidth = 200;
    const cardHeight = 300;

    drawnCardPlayer.forEach((card, index) => {
        const cardElement = document.createElement('img');
        // imageBaseUrl wird oben im Template gesetzt und ist im globalen Scope verfügbar
        cardElement.src = `${imageBaseUrl}${card.cardName}.png`;
        cardElement.alt = `${card.kindOfCard} of ${card.suit}`; 
        cardElement.style.position = 'absolute';
        cardElement.style.left = `${index * 300}px`; // Karten versetzen
        cardElement.style.top = '0px';
        cardElement.style.width = `${cardWidth}px`;
        cardElement.style.height = `${cardHeight}px`;
        handOfPlayer.appendChild(cardElement);
    });
}


function updateDealerHand(){
    const handOfDealer = document.getElementById('dealerCardsID');
    handOfDealer.innerHTML = ''; // Vorherige Karten entfernen, falls vorhanden

    const cardWidth = 200;
    const cardHeight = 300;
    // Wenn drawnCardDealer nicht leer ist, dann Karten einfügen
    if (drawnCardDealer.length > 0) {
        drawnCardDealer.forEach((card, index) => {
            const cardElement = document.createElement('img');
            cardElement.src = `${imageBaseUrl}${card.cardName}.png`;
            cardElement.alt = `${card.kindOfCard} of ${card.suit}`; 
            cardElement.style.position = 'absolute';
            cardElement.style.left = `${index * 220}px`; // Karten leicht versetzen
            cardElement.style.top = '0px';
            cardElement.style.width = `${cardWidth}px`;
            cardElement.style.height = `${cardHeight}px`;
    
            // Karte in den Dealer-Container einfügen
            handOfDealer.appendChild(cardElement);
        });
    }
}

function deckOfCards() {
    const deckCards = document.getElementById('deck')
    const cardWidth = 200;
    const cardHeight = 300;

    if (!deckCards) {
        console.error("Das Element mit der ID 'deck' wurde nicht gefunden.");
        return;
    }

    const cardsOfDeck = document.createElement('img')
    
    cardsOfDeck.src =`${imageBaseUrl}back_light.png`
    cardsOfDeck.width = cardWidth
    cardsOfDeck.height = cardHeight
    deckCards.appendChild(cardsOfDeck)
}

function listenForInputs(action) {
    if (trackerPlayer !== "out"){
        if (action === "hit") {
            currentDescision = "hit";
        } else if (action === "stand") {
            currentDescision = "stand";
        } else if (action === "split") {
            alert("Coming soon");
        }
    }
}

// Animations
//              Das ist iwie arsch idk
// function animateDrawnCards(time, targetX, targetY, startX, startY, backCard, duration, startTime) {
//     if (!startTime) startTime = time;
//     console.log("AAA")
//     const elapsed = time - startTime;
//     const progressOfAnimation = Math.min(elapsed / duration, 1);
    
//     const currentX = startX + (targetX - startX) * progressOfAnimation;
//     const currentY = startY + (targetY - startY) * progressOfAnimation;
    
//     backCard.style.left = `${currentX}px`;
//     backCard.style.top = `${currentY}px`;

    
//     requestAnimationFrame(function(time) {
//         animateDrawnCards(time, targetX, targetY, startX, startY, backCard, duration, startTime);
//     });
// }
function animateCardsToOperator(operator) {
    console.log(operator)
    let targetX, targetY = null
    if (operator === 'player') {
        targetX = (drawnCardPlayer.length) * 300 + 150 - 7 // Keine Ahnung warum 7 :weinen:
        targetY = 300
    } 
    else if (operator === 'dealer') {
        targetX = (drawnCardDealer.length) * 220 + 400 - 7
        targetY = -380
    }
    animationIsRunning = true
    gsap.to("#movingCard", {
        x: 2000, // Korrekte Position, geht nicht besser da relative Bewegung. Wenn start in css left  : 2000; dann relative Bewegung von dort aus. If it works dont fix if
        y: 0,
        duration: 0,
        onComplete: function() {
            document.getElementById('movingCard').style.visibility = 'visible';
        }
    });
    gsap.to("#movingCard", {
        x: targetX,
        y: targetY,
        duration: 1,
        onComplete: function() {
            animationIsRunning = false;
            document.getElementById('movingCard').style.visibility = 'hidden';
            updateGamestate()
        }
    });
}



// Logics
function player1(descision){
    if (descision === "hit"){
        animateCardsToOperator('player')
        // != Animation is running
        drawnCardPlayer.push(drawACard('player'))
        console.log(`Player hat eine ${drawnCardPlayer[drawnCardPlayer.length - 1].kindOfCard} gezogen`)
        console.log(`Player hat ${combinedValue(drawnCardPlayer)}`)
    }
    else if (descision === "stand"){
        console.log("Player stands")
        trackerPlayer = "out"
    }
}

function dealer(){
    if (combinedValue(drawnCardDealer) <= 17){
        animateCardsToOperator('dealer')
        drawnCardDealer.push(drawACard()) // Drawing a card and Adding it to deck
        console.log(`Dealer hat eine ${drawnCardDealer[drawnCardDealer.length - 1].kindOfCard} gezogen`)
        console.log(`Dealer hat ${combinedValue(drawnCardDealer)} von 21`)
    }
    else{
        console.log("The dealer stands")
        trackerDealer = "stood";
    }
}

// Initializing
function gameStart(press){ 
    if (press){
        gameReset()
        document.getElementById("resetButton").style.visibility = 'hidden';
        document.getElementById('controll').style.visibility = 'visible'

        
        drawnCardPlayer.push(drawACard())
        drawnCardPlayer.push(drawACard())
        
        drawnCardDealer.push(drawACard())

        const textPlayer = `The player drew ${drawnCardPlayer[0].kindOfCard} of ${drawnCardPlayer[0].suit}, and a ${drawnCardPlayer[1].kindOfCard} of ${drawnCardPlayer[0].suit}, so ${combinedValue(drawnCardPlayer)}`
        const textDealer = `Dealer: Upcard: ${drawnCardDealer[0].kindOfCard} so ${combinedValue(drawnCardDealer)}` 
        // document.getElementById("playerStatus").innerHTML = textPlayer
        // document.getElementById("dealerStatus").innerHTML = textDealer

        let counterPlayer = `${combinedValue(drawnCardPlayer)} / 21`
        document.getElementById("playerCounter").innerHTML = counterPlayer

        let counterDealer = `${combinedValue(drawnCardDealer)} / 21`
        document.getElementById("dealerCounter").innerHTML = counterDealer
        deckOfCards()
    }
}

function gameReset(){
    stapelPlayer = null;
    stapelDealer = null;
    trackerDealer = "in";
    trackerPlayer = "in";


    askForDescision = false
    currentDescision = null
    gameover = false
    currentTurn = "player"

    drawnCardDealer = []
    drawnCardPlayer = []
    xyz = 0
    // document.getElementById("playerStatus").innerHTML = null;
    // document.getElementById("dealerStatus").innerHTML = null;
    // document.getElementById("gameResult").innerHTML = null;
    document.getElementById("deck").innerHTML = null;
    document.getElementById('playerCarsID').innerHTML = null;
    document.getElementById('dealerCardsID').innerHTML = null;

}

// Game loop
function gameLogics() {
    if (gameover) {
        document.getElementById("resetButton").style.visibility = 'visible';
        console.log('Gameover')
    }
    if (combinedValue(drawnCardPlayer) === 21) {
        checkWinner()
    }
    if (currentTurn === "player" && trackerPlayer === "in") {
        if (currentDescision === "hit") {
            player1("hit");
            currentDescision = null;
            if (combinedValue(drawnCardPlayer) > 21) {
                gameover = true;
                //document.getElementById("gameResult").innerHTML =  "Player Busts! Dealer gewinnt.";
                return;
            }
        } else if (currentDescision === "stand") {
            //document.getElementById("dealerStatus").innerHTML =  "Player stands.";
            currentDescision = null;
            currentTurn = "dealer";
        }
    } else if (currentTurn === "dealer" && trackerDealer === "in") {
        if (combinedValue(drawnCardDealer) <= 17) {
            xyz++;
            if (xyz === 10) {
                dealer();
                xyz = 0
            }
        } else {
            updateGamestate()
            // document.getElementById("dealerStatus").innerHTML = "Dealer stands.";
            checkWinner(); // Gewinner prüfen
        }
    }
}

// SetInterval, um die Spiel-Logik alle 100ms auszuführen

gameStart(true)

let gameInterval = setInterval(() => {
    if (!animationIsRunning) {
        updateGamestate()
        gameLogics();
    }
}, 100);


// Todo:


// BUGS