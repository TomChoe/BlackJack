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
const imgFace = "./images/facecards/"

function createDeck() {
	this.value = [2, 3, 4, 5, 6, 7, 8, 9, 10];
	this.face = ['A', 'J', 'Q', 'K'];
	this.suit = ['C', 'D', 'H', 'S'];

	for (s = 0; s < suit.length; s++) {
		for (i = 0; i < value.length; i ++) {
			deck.push(new card(value[i], suit[s], imgNum+value[i]+suit[s]+'.jpg'));	
		}
	}	

	for (s = 0; s < suit.length; s++) {
		for (f = 0; f < face.length; f++) {
			deck.push(new faceCard(face[f], suit[s], 10, imgFace+face[f]+suit[s]+'.jpg'));
		}
	}

	for (i = 0; i < deck.length; i++) {
		if (deck[i].face === 'A') {
			deck[i].value = 11;
		}
	}

	$('.deck').append("<img id = 'deckCard' src ='./images/cardback.jpg'/>")
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
	bank = parseInt(bank);
	bet = parseInt(bet);
	
	for (i = 0; i < 2; i++) {
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
		reset();
	}
	for (c = 0; c < playerHand.length; c++) {
		if (currentHand > 21 && playerHand[c].face === 'A') {
			playerHand[c].value = 1;
		}

	}
	$('#btnDeal').remove();
	const hitB = $('<button id = "hit">HIT</button>').click(hit);						// credit to Instructors
	const standB = $('<button id = "stand">STAND</button>').click(stand)
	const ddB = $('<button id = "double">DOUBLE DOWN</button>').click(doubleDown)
	$('.buttons').append(hitB, standB, ddB)
}

function wager() {							        	// using the bet button to store a bet and return or lose based on 
	bet = 0;
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
	playerHand.push(deck.pop());
	$('.playerCards').append('<img id = "playCard" src = '+playerHand[playerHand.length-1].img+'>')

	let pHand = 0;

	for (p = 0; p < playerHand.length; p++) {
		bank = parseInt(bank);
		bet = parseInt(bet);
		console.log('in the loop for hand length')
		pHand += playerHand[p].value;
		
		if (pHand > 21) {
			alert(`Busted! you have ${pHand} You lose ${bet}`);
			bank = bank - bet;
			$('.buttons').remove();
			$('#bank').html(bank);
			reset()
		}
	
		if (pHand > 21 && playerHand[p].face === 'A') {
			playerHand[p].value = 1;
		}
	}
	$('#total').text(bank);
}

function stand() {
	$('.buttons').remove();
	$('#hidden').remove();
	$('.dealerCards').append("<img id = 'dealt' src = "+dealerHand[0].img+">")
	bank = parseInt(bank);
	bet = parseInt(bet);
	let dealer = dealerHand[0].value + dealerHand[1].value;
	let player = playerHand.reduce((a, i) => {
		 a += i.value
		 return a
	}, 0)

	while (dealer < 17) {
			dealerHand.unshift(deck.pop());
			dealer += dealerHand[0].value;
			$('.dealerCards').append("<img id = 'dealt' src = "+dealerHand[0].img+">")
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
		for (d = 0; d < dealerHand.length; d++) {
			if (dealer > 21 && dealerHand[d].face === 'A') {
				dealerHand[d].value = 1;
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
	reset();
}

function doubleDown() {
	$('.buttons').remove();
	bet = bet * 2;
	hit();
	stand();
}

function reset() {
	if (bank === 0) {
		alert('You are broke, you may need help') 
		document.location.reload();
	}
	alert('Click ok to play again')
	sessionStorage.setItem('bank', bank);
	window.location.reload();
}

$( document ).ready(function() {
	console.log('ready');
    createDeck();
    $('.bank').append('<div id = "total">Current bank total $ '+bank+'</div>')
    $('#betbutton').click(wager);
});