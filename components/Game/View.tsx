import { useMemo, useContext } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'

import theme from '../../lib/theme'
import GameContext from '../../lib/game/context'
import gameStatus from '../../lib/game/status'
import GameState from '../../lib/game/state'
import ROUNDS from '../../lib/game/rounds'
import JoiningView from './JoiningView'
import StartedView from './StartedView'
import CompletedView from './CompletedView'

const GameView = () => {
	const [game] = useContext(GameContext)
	const status = useMemo(() => game && gameStatus(game), [game])

	if (!(game && status)) return null

	return (
		<View style={styles.root}>
			{!game.self && <Text style={styles.spectating}>spectating</Text>}
			{game.state === GameState.Started && (
				<Text style={styles.rounds}>
					Round {game.round}/{ROUNDS}
				</Text>
			)}
			<Text style={styles.status}>{status}</Text>
			{game.state === GameState.Joining && <JoiningView />}
			{game.state === GameState.Started && <StartedView />}
			{game.state === GameState.Completed && <CompletedView />}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
		paddingVertical: 24,
		paddingHorizontal: 32
	},
	spectating: {
		position: 'absolute',
		top: 24,
		right: 32,
		fontSize: 18,
		fontWeight: '900',
		color: theme.white,
		opacity: 0.5
	},
	rounds: {
		marginBottom: 6,
		fontSize: 18,
		fontWeight: '900',
		color: theme.white
	},
	status: {
		fontSize: Platform.OS === 'web' ? 30 : 24,
		fontWeight: '900',
		color: theme.white
	}
})

export default GameView
