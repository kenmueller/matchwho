import { useMemo, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import theme from '../../lib/theme'
import GameContext from '../../lib/game/context'
import gameStatus from '../../lib/game/status'
import GameState from '../../lib/game/state'
import ROUNDS from '../../lib/game/rounds'

const GameView = () => {
	const [game] = useContext(GameContext)
	const status = useMemo(() => game && gameStatus(game), [game])

	if (!(game && status)) return null

	return (
		<View style={styles.root}>
			{game.state === GameState.Started && (
				<Text style={styles.rounds}>
					Round {game.round}/{ROUNDS}
				</Text>
			)}
			<Text style={styles.status}>{status}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		paddingVertical: 24,
		paddingHorizontal: 32
	},
	rounds: {
		marginBottom: 12,
		fontSize: 18,
		fontWeight: '900',
		color: theme.white
	},
	status: {
		fontSize: 30,
		fontWeight: '900',
		color: theme.white
	}
})

export default GameView
