import { useState, useCallback, useEffect } from 'react'
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity
} from 'react-native'
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native'

import { AppScreens } from '../navigators/App'
import theme from '../lib/theme'
import createGameStream, { GameStream } from '../lib/api/gameStream'
import GameState from '../lib/game/state'
import Game from '../lib/game'
import gameMeta from '../lib/api/gameMeta'
import gameMetaStatus from '../lib/game/metaStatus'
import MAX_NAME_LENGTH from '../lib/game/name'

const GameScreen = () => {
	const navigation = useNavigation<NavigationProp<AppScreens>>()

	const route = useRoute<RouteProp<AppScreens>>()
	const { code, meta } = route.params!

	const [name, setName] = useState('')
	const [gameStream, setGameStream] = useState<GameStream | null>(null)

	const [game, setGame] = useState<Game | null>(null)

	const joining = gameStream !== null && !game
	const isJoinDisabled = !name

	const join = useCallback(() => {
		const newGameStream = createGameStream(code, name)

		newGameStream.onData(async data => {
			switch (data.key) {
				case 'game':
					setGame(data.value)
					break
				case 'next':
					navigation.navigate('Game', {
						code: data.value,
						meta: await gameMeta(data.value)
					})
					break
			}
		})

		setGameStream(newGameStream)
	}, [code, name, navigation, setGame, setGameStream])

	useEffect(() => {
		navigation.setOptions({
			title: `${
				gameStream && game ? 'Game running' : gameMetaStatus(meta)
			} | Match Who`
		})
	}, [navigation, gameStream, game, meta])

	useEffect(() => {
		// Spectate if game has already started
		if (meta.state !== GameState.Joining) join()
	}, [meta, join])

	useEffect(() => {
		if (!gameStream) return

		return () => {
			gameStream.close()
		}
	}, [gameStream])

	return (
		<View style={styles.root}>
			{gameStream && game ? (
				<Text style={{ color: theme.white }}>GameView</Text>
			) : meta.state === GameState.Joining ? (
				<View style={styles.joinForm}>
					<TextInput
						value={name}
						placeholder="Name"
						placeholderTextColor={theme.yellowWithOpacity(0.5)}
						maxLength={MAX_NAME_LENGTH}
						onChangeText={setName}
						style={styles.joinInput}
					/>
					<TouchableOpacity
						disabled={joining || isJoinDisabled}
						onPress={join}
						style={[
							styles.join,
							(joining || isJoinDisabled) && styles.disabled
						]}
					>
						<Text style={styles.joinText}>Join Game</Text>
					</TouchableOpacity>
				</View>
			) : /* Joining as a spectator */ null}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		backgroundColor: theme.dark
	},
	joinForm: {
		maxWidth: 300,
		width: '100%',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	joinInput: {
		width: '100%',
		paddingVertical: 8,
		paddingHorizontal: 16,
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow,
		borderWidth: 2,
		borderColor: theme.yellow,
		borderRadius: 16
	},
	join: {
		marginTop: 16,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	joinText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	disabled: {
		opacity: 0.5
	}
})

export default GameScreen
