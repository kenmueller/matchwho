import type Player from '../player'
import type GameState from '../state'

type IncomingGameData = { key: 'game'; value: GameValue }

export interface GameValue {
	state: GameState
	current: Player
	players: Player[]
}

export default IncomingGameData