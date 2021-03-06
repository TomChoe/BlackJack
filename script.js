class card {
	constructor(value, suit, img) {
	this.value = value;
	this.suit = suit;
	this.img = img;
	}
}

class faceCard {
	constructor(face, suit, value, img) {
		this.face = face;
		this.suit = suit;
		this.value = value;
		this.img = img;
	}
}

let deck = [];

let dealerHand = [];

let playerHand = [];

let bank = Number(sessionStorage.getItem('bank')) || 100;

let bet = 0;

const imgNum = "./images/numbercards/";       // images src
const imgFace = "./images/facecards/";
const next = $('<button id= "next">Next Round</button>').click(reset);

function createDeck() {
	this.value = [2, 3, 4, 5, 6, 7, 8, 9, 10];
	this.face = ['A', 'J', 'Q', 'K'];
	this.suit = ['C', 'D', 'H', 'S'];

	for (let s = 0; s < suit.length; s++) {
		for (let i = 0; i < value.length; i ++) {
			deck.push(new card(value[i], suit[s], imgNum+value[i]+suit[s]+'.jpg'));	
		}
	}	

	for (let t = 0; t < suit.length; t++) {
		for (let f = 0; f < face.length; f++) {
			deck.push(new faceCard(face[f], suit[t], 10, imgFace+face[f]+suit[t]+'.jpg'));
		}
	}

	for (let r = 0; r < deck.length; r++) {
		if (deck[r].face === 'A') {
			deck[r].value = 11;
		}
	}

	$('.deck').append("<img id = 'deckCard' src ='./images/grayback.jpg'/>")
	shuffleDeck()
}

function shuffleDeck(array) {
	deck.forEach((d, i) => {
		let rand = Math.floor(Math.random() * deck.length);
		let temp = deck[i];
		deck[i] = deck[rand]										// fisher yates method for randomizing array
		deck[rand] = temp;
	});
}

function deal() {
	bank = Number(bank);
	bet = Number(bet);
	
	// dealing for player and dealer
	for (let i = 0; i < 2; i++) {
		playerHand.push(deck.pop());
		$('.playerCards').append('<img id = "playCard" src = '+playerHand[i].img+'>')
		dealerHand.push(deck.pop());
	}
	$('.dealerCards').append("<img id = 'hidden' src = './images/grayback.jpg'>")
	$('.dealerCards').append("<img id = 'dealt' src = "+dealerHand[1].img+">")
	currentHand = playerHand[0].value + playerHand[1].value;
	
	if (currentHand === 21) {
		alert(`BlackJack! You win $${bet}`)
		$('.buttons').remove();
		$('#bank').html(bank);
		bank = bank + bet;
		$('#reset').append(next);
	} else if (currentHand > 21 && playerHand[0].face === "A") {
		playerHand[0].value = 1;
	}

	$('#btnDeal').remove();
	const hitB = $('<button id = "hit">HIT</button>').click(hit);						// credit to Instructors
	const standB = $('<button id = "stand">STAND</button>').click(stand)
	const ddB = $('<button id = "double">DOUBLE DOWN</button>').click(doubleDown)
	$('.buttons').append(hitB, standB, ddB)
}

function wager() {							        	// using the bet button to store a bet and return or lose based on 
	bet = $('#number').val();
	const dealB = $('<button id = "btnDeal">DEAL</button>').click(deal);
	
	if (bet > bank) {
		alert("You can't bet more than what you have")
		window.location.reload();
	} 
	console.log(bet);
	$('.wager').remove();
	$('.buttons').append(dealB);
}

function hit() {
	bank = Number(bank);
	bet = Number(bet);
	playerHand.push(deck.pop());
	$('.playerCards').append('<img id = "playCard" src = '+playerHand[playerHand.length-1].img+'>')
	let pHand = playerHand.reduce((a, i) => {
		 a += i.value
		 return a
	}, 0);

	if (pHand > 21 && playerHand[playerHand.length-1].face === "A") {       // checks value of the new card
		pHand -= playerHand[playerHand.length-1].value;
		playerHand[playerHand.length-1].value = 1;
		pHand += playerHand[playerHand.length-1].value;
	} 

	for (let p = 0; p < playerHand.length; p++) {						// checks to see if aces are in hand 
		if (pHand > 21 && playerHand[p].face === "A") {
			pHand -= playerHand[p].value;
			playerHand[p].value = 1;
			pHand += playerHand[p].value;
		} else if (pHand > 21) {
			alert(`Busted! you have ${pHand} You lose ${bet}`);
			bank = bank - bet;
			$('.buttons').remove();
			$('#bank').html(bank);
			$('#reset').append(next);
			return;
		}
	$('#total').text(bank);
	}
}

function stand() {
	$('.buttons').remove();
	$('#hidden').remove();
	$('.dealerCards').append("<img id = 'dealt' src = "+dealerHand[0].img+">")
	bank = Number(bank);
	bet = Number(bet);
	let dealer = dealerHand[0].value + dealerHand[1].value;
	let player = playerHand.reduce((a, i) => {
		 a += i.value
		 return a
	}, 0)

	while (dealer < 17) {
			dealerHand.unshift(deck.pop());
			dealer += dealerHand[0].value;
			$('.dealerCards').append("<img id = 'dealt' src = "+dealerHand[0].img+">")

			if (dealer > 21 && dealerHand[0].face === 'A') {
				dealer -= dealerHand[0].value;
				dealerHand[0].value = 1;
				dealer += dealerHand[0].value;
			} 

			for (let d = 0; d < dealerHand.length; d++) {
				if (dealer > 21 && dealerHand[d].face === 'A') {
					dealerHand -= dealerHand[d].value;
					dealerHand[d].value = 1;
					dealerHand += dealerHand[d].value;
				}
			}
			
			if (dealer > 21) {
				bank = bank + bet;
				alert(`dealer busted! You win $${bet}`);
			} else if (dealer === 21 && player != 21) {
				bank = bank - bet;
				alert(`dealer blackjack! You lose $${bet}`)
			} else if (player === dealer) {
				alert('Push!')
			}
	}
			if (player > dealer) {
				bank = bank + bet;
				alert(`Player wins! $${bet} has been added to the bank`);
			} else if (dealer > player && dealer <=21) {
				bank = bank - bet;
				alert(`Dealer wins! You lose $${bet}`);
			}
	$('#total').html(bank)
	$('#reset').append(next);
}

function doubleDown() {
	bet = bet * 2;
	$('#hit').remove();
	$('#double').remove();
	hit();
}

function reset() {
	if (bank < 1) {
		alert('You are broke, you may need help') 
		document.location.reload();
	}
	sessionStorage.setItem('bank', bank);
	window.location.reload();
}

$(document).ready(function() {
	console.log('ready');
    createDeck();
    $('.bank').append('<div id = "total">Current bank total $ '+bank+'</div>')
    $('#betbutton').click(wager);
});