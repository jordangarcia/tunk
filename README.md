tunk
====

TUNK!

Build and watch for development
```js
npm run build-dev
```

Start development server
```js
npm start
// or 
npm run start-dev
```

** Entities **
```javascript
User {
	id:
	name:
	chips:
	stats: {
		stake: {}
		tournament: {}
	}
	// additional metadata
}

Room {
	id:
	clients: []
	game: Game
	status: (started|running|completed)
	type: (stake|tournament)
	stake: // minimum payout for stake games
	winAmount: // for tournament
}

Game {
	deck: Deck
	discardPile: DiscardPile
	players: PlayerList
	log: Gamelog
	turn: {}
}

/**
 * Player in a Game
 */
Player {
	client: Client
	hand: []
	playedSets: []
	score: 0 // for tournament player
	isFrozen: (bool)
}
```
