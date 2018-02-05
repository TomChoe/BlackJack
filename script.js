class card {
	constructor(value, suit) {
	this.value = value;
	this.suit = suit;
	}
}

class faceCard {
	constructor(face, suit, value) {
		this.face = face;
		this.suit = suit;
		this.value = value;
	}
}

let deck = [];

let dealerHand = [];

let playerHand = [];

let bank = 100;

let bet;

function createDeck() {
	this.value = [2, 3, 4, 5, 6, 7, 8, 9, 10];
	this.face = ['jack', 'queen', 'king', 'ace'];
	this.suit = ['heart', 'diamond', 'spade', 'club'];

	for (s = 0; s < suit.length; s++) {
		for (i = 0; i < value.length; i ++) {
			deck.push(new card(value[i], suit[s]));	
		}
	}	

	for (s = 0; s < suit.length; s++) {
		for (f = 0; f < face.length; f++) {
			deck.push(new faceCard(face[f], suit[s], 10));
		}
	}

	for (i = 0; i < deck.length; i++) {
		if (deck[i].face === 'ace') {
			deck[i].value = 11;
		}
	}

	shuffleDeck()
}

createDeck()

function shuffleDeck(array) {
	deck.forEach((d, i) => {
		let rand = Math.floor(Math.random() * deck.length);
		let temp = deck[i];
		deck[i] = deck[rand]								// fisher yates method for randomizing array
		deck[rand] = temp;
	});
}

console.log(deck)

function deal() {
	for (i = 0; i < 2; i++) {
		playerHand.push(deck.pop());
		dealerHand.push(deck.pop());
	}
	currentHand = playerHand[0].value + playerHand[1].value;
	console.log(`This is players current total ${currentHand}`);
	if (currentHand === 21) {
		alert('BlackJack!')
	}
	console.log(dealerHand)
	console.log(`Please place your bets`)
}

deal();

function wager() {								// using the bet button to store a bet and return or lose based on 
	bet = 0;
	bet = $('#number').val();
	console.log(bet);
}

$('#betbutton').click(wager);

console.log(bet);


function hit() {
	playerHand.push(deck.pop());
	let pHand = 0;
	for (p = 0; p < playerHand.length; p++) {
		pHand += playerHand[p].value;
		if (pHand > 21) {
			alert(`Busted! you have ${pHand}`);
		} 
	}
	console.log(`Players current total ${pHand}`)
	console.log(playerHand);
}

$('#hit').click(hit);


function stand() {
	let dealer = dealerHand[0].value + dealerHand[1].value;

	while (dealer < 17) {
			dealerHand.unshift(deck.pop());
			dealer += dealerHand[0].value;

			if (dealer > 21) {
				console.log('busted');
			} else if (dealer === 21) {
				console.log('blackjack!')
			}
		} 
		
	console.log(dealer)
						/* dealerHand.forEach((b, i) => {
						let dealer += dealerHand[i].value;
						});
						console.log(dealer); */
}

$('#stand').click(stand);

function doubleDown() {
	bet = bet * 2;
}

function reset() {
	document.reload();
}


//$( document ).ready(function() {
    console.log( "ready!" );
//});