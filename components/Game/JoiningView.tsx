import { useState, useContext, useCallback } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

import GameContext from '../../lib/game/context'
import GameStreamContext from '../../lib/game/context/stream'
import { MIN_PLAYERS } from '../../lib/game/player/bounds'
import GameState from '../../lib/game/state'
import Message from './Message'
import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'

const GameJoiningView = () => {
	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)

	const [started, setStarted] = useState(false)

	const start = useCallback(() => {
		try {
			if (!gameStream) return

			setStarted(true)
			gameStream.send({ key: 'start' })
		} catch (error) {
			setStarted(false)
			alertError(error)
		}
	}, [gameStream, setStarted])

	if (!(gameStream && game)) return null

	const leader = game.leader
	const isLeader = leader && leader.id === game.self?.id

	const loading = started && game.state === GameState.Joining
	const disabled = game.players.length < MIN_PLAYERS

	return (
		<View style={styles.root}>
			{isLeader ? (
				<TouchableOpacity
					disabled={loading || disabled}
					onPress={start}
					style={[
						styles.start,
						(loading || disabled) && styles.disabled
					]}
				>
					<Text style={styles.startText}>Start</Text>
				</TouchableOpacity>
			) : (
				<Message
					title={`Waiting ${
						leader ? `for ${leader.name} ` : ''
					}to start the game`}
				/>
			)}
			{disabled && (
				<Text style={styles.players}>
					There must be at least {MIN_PLAYERS} players
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		alignSelf: 'center',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	start: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 300,
		paddingVertical: 16,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	startText: {
		fontSize: 22,
		fontWeight: '700',
		color: theme.yellow
	},
	players: {
		marginTop: 12,
		fontSize: 16,
		fontWeight: '700',
		color: theme.red
	},
	disabled: {
		opacity: 0.5
	}
})

export default GameJoiningView
