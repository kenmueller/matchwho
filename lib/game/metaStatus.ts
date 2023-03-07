import GameMeta from './meta'
import GameState from './state'

const gameMetaStatus = (meta: GameMeta) => {
	switch (meta.state) {
		case GameState.Joining:
			return `Join ${meta.leader ?? 'Game'}`
		case GameState.Started:
			return `Spectate ${meta.leader ?? 'Game'}`
		case GameState.Completed:
			return 'Game over'
	}
}

export default gameMetaStatus
