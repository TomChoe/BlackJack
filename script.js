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

let bet = 0;

function createDeck() {
	this.value = [2, 3, 4, 5, 6, 7, 8, 9, 10];
	this.face = ['jack', 'queen', 'king', 'ace'];
	this.suit = ['club', 'diamond', 'heart', 'spade'];

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
	$('.deck').append("<img id = 'deckCard' src ='./images/cardback.jpg'/>")
	shuffleDeck()
}

function shuffleDeck(array) {
	deck.forEach((d, i) => {
		let rand = Math.floor(Math.random() * deck.length);
		let temp = deck[i];
		deck[i] = deck[rand]								// fisher yates method for randomizing array
		deck[rand] = temp;
	});
}

console.log(`Please place your bets`)

function deal() {
	bank = parseInt(bank);
	bet = parseInt(bet);
	
	for (i = 0; i < 2; i++) {
		playerHand.push(deck.pop());
		dealerHand.push(deck.pop());
	}
	currentHand = playerHand[0].value + playerHand[1].value;
	console.log(`Players hand ${currentHand}`);
	
	if (currentHand === 21) {
		alert('BlackJack!')
		$('#hit').remove();
		$('#stand').remove();
		$('#double').remove();
		$('#bank').html(bank);
		bank = bank + bet;
		console.log(bank)
	}
	console.log(`Dealers hand ${dealerHand[0].value + dealerHand[1].value}`)
	$('#deal').hide();
	$('#hit').append('<button>HIT</button>').click(hit);
	$('#stand').append('<button>STAND</button>').click(stand)
	$('#double').append('<button>DOUBLE DOWN</button>').click(doubleDown)

}

function wager() {								// using the bet button to store a bet and return or lose based on 
	bet = 0;
	bet = $('#number').val();
	
	if (bet > bank) {
		alert("You can't bet more than what you have")
	}
	console.log(bet);
	$('.wager').remove();
	$('#deal').append('<button id = "btnDeal">DEAL</button>').click(deal);
}

function hit() {
	playerHand.push(deck.pop());
	let pHand = 0;

	for (p = 0; p < playerHand.length; p++) {
		bank = parseInt(bank);
		bet = parseInt(bet);
		console.log('in the loop for hand length')
		pHand += playerHand[p].value;
		
		if (pHand > 21) {
			console.log(`Busted! you have ${pHand}`);
			bank = bank - bet;
			$('#hit').remove();
			$('#stand').remove();
			$('#double').remove();
			$('#bank').html(bank);
			console.log(bank)
		}
	
		if (pHand > 21 && playerHand[p].face === 'ace') {
			playerHand[p].value = 1;
		}
	}
	$('#total').text(bank);
	console.log(`Players current total ${pHand}`)
}

function stand() {
	$('#hit').remove();
	$('#stand').remove();
	$('#double').remove();
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
			if (dealer > 21) {
				bank = bank + bet;
				console.log('dealer busted');
			} else if (dealer === 21 && player != 21) {
				bank = bank - bet;
				console.log('dealer blackjack!')
			} else if (player === dealer) {
				console.log('Push!')
			}
			for (d = 0; dealerHand.length; d++) {
				if (dealer > 21 && dealerHand[d].face === 'ace') {
				playerHand[p].value = 1;
			}
	}

			if (player > dealer) {
				bank = bank + bet;
				console.log('Player wins!');
			} else if (dealer > player && dealer <=21) {
				bank = bank - bet;
				console.log(`Dealer wins!`);
			}
		}

	$('#total').html(bank)

	console.log(`current dealers hand equals ${dealer}`);
	
	console.log(`this is players hand after stand ${player}`)

	console.log(`This is left in the bank ${bank}`)
}

function doubleDown() {
	$('#hit').remove();
	$('#double').remove();
	bet = bet * 2;
	hit();
}

function reset() {
	document.reload();
}


$( document ).ready(function() {
    createDeck();
    $('.bank').append('<div id = "total">You have $ '+bank+'</div>')
    console.log(deck)
    $('#betbutton').click(wager);
});