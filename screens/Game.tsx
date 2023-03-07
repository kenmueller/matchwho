import { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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

const GameScreen = () => {
	const navigation = useNavigation<NavigationProp<AppScreens>>()

	const route = useRoute<RouteProp<AppScreens>>()
	const { code, meta } = route.params!

	const [name, setName] = useState('')
	const [gameStream, setGameStream] = useState<GameStream | null>(null)

	const [game, setGame] = useState<Game | null>(null)

	const joining = gameStream !== null && !game

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
				<Text style={styles.text}>GameView</Text>
			) : meta.state === GameState.Joining ? (
				<Text style={styles.text}>Join Game</Text>
			) : /* Joining as a spectator */ null}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.dark
	},
	text: {
		color: theme.white
	}
})

export default GameScreen
