import Game from '.'
import { MAX_PLAYERS } from './player/bounds'
import GameState from './state'
import GameTurnState from './turn/state'

const gameStatus = (game: Game) => {
	switch (game.state) {
		case GameState.Joining:
			return `Waiting for players (${game.players.length}/${MAX_PLAYERS})`
		case GameState.Started: {
			const myTurn = game.turn?.player.id === game.self?.id

			switch (game.turn?.state) {
				case GameTurnState.Waiting:
					return myTurn
						? 'Ask a question'
						: 'Should be any time now...'
				case GameTurnState.Answering:
					return myTurn ? 'Should be any time now...' : 'Answer time!'
				case GameTurnState.Matching:
					return game.turn.correct
						? `${
								myTurn
									? "You've"
									: `${game.turn.player.name} has`
						  } finished matching`
						: myTurn
						? 'Start matching!'
						: `${game.turn.player.name} is matching`
				default:
					return "Oops! Something isn't right"
			}
		}
		case GameState.Completed:
			return 'Game over'
	}
}

export default gameStatus
