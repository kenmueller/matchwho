import { useState, useCallback, useEffect } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {
	useRoute,
	RouteProp,
	useNavigation,
	StackActions,
	CompositeNavigationProp
} from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { StackNavigationProp } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'

import { AppScreens } from '../navigators/App'
import theme from '../lib/theme'
import createGameStream, { GameStream } from '../lib/api/gameStream'
import GameState from '../lib/game/state'
import Game from '../lib/game'
import gameMeta from '../lib/api/gameMeta'
import gameMetaStatus from '../lib/game/metaStatus'
import { GameScreens } from '../navigators/Game'
import JoinGame from '../components/Game/Join'

const GameScreen = () => {
	const navigation =
		useNavigation<
			CompositeNavigationProp<
				DrawerNavigationProp<GameScreens, 'GameInternal'>,
				StackNavigationProp<AppScreens, 'Game'>
			>
		>()

	const route = useRoute<RouteProp<GameScreens, 'GameInternal'>>()
	const { code, meta } = route.params

	const [gameStream, setGameStream] = useState<GameStream | null>(null)
	const [game, setGame] = useState<Game | null>(null)

	const joining = gameStream !== null && !game

	const join = useCallback(
		(name: string | null) => {
			const newGameStream = createGameStream(code, name)

			newGameStream.onData(async data => {
				switch (data.key) {
					case 'game':
						setGame(data.value)
						break
					case 'next':
						navigation.dispatch(
							StackActions.replace('Game', {
								code: data.value,
								meta: await gameMeta(data.value)
							})
						)
						setGameStream(null)
						break
				}
			})

			setGameStream(newGameStream)
		},
		[code, navigation, setGame, setGameStream]
	)

	const showPlayers = useCallback(() => {
		navigation.openDrawer()
	}, [navigation])

	const close = useCallback(() => {
		navigation.dispatch(StackActions.replace('Home'))
	}, [navigation])

	useEffect(() => {
		// Spectate if game has already started
		if (meta.state !== GameState.Joining) join(null)
	}, [meta, join])

	useEffect(() => {
		if (!gameStream) return

		return () => {
			gameStream.close()
		}
	}, [gameStream])

	useEffect(() => {
		navigation.setOptions({
			title: `${
				gameStream && game ? 'Game running' : gameMetaStatus(meta)
			} | Match Who`
		})
	}, [navigation, gameStream, game, meta])

	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<Text style={styles.title}>
					Game code: <Text style={styles.titleCode}>{code}</Text>
				</Text>
			)
		})
	}, [navigation, code])

	useEffect(() => {
		navigation.setOptions({
			headerLeft: () =>
				game && (
					<TouchableOpacity
						onPress={showPlayers}
						style={styles.players}
					>
						<MaterialIcons
							name="people"
							style={styles.playersIcon}
						/>
						{Platform.OS === 'web' && (
							<Text style={styles.playersText}>Players</Text>
						)}
					</TouchableOpacity>
				)
		})
	}, [navigation, game, showPlayers])

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={close} style={styles.close}>
					<MaterialIcons name="close" style={styles.closeIcon} />
				</TouchableOpacity>
			)
		})
	}, [navigation, close])

	return (
		<View style={styles.root}>
			{gameStream && game ? (
				<Text style={{ color: theme.white }}>GameView</Text>
			) : meta.state === GameState.Joining ? (
				<JoinGame joining={joining} join={join} />
			) : /* Joining as a spectator */ null}
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.white
	},
	titleCode: {
		color: theme.yellow
	},
	players: {
		flexDirection: 'row',
		marginLeft: 24,

		// @ts-ignore
		cursor: 'pointer'
	},
	playersIcon: {
		fontSize: 30,
		color: theme.white
	},
	playersText: {
		marginLeft: 8,
		fontSize: 20,
		fontWeight: '700',
		color: theme.white
	},
	close: {
		marginRight: 24,

		// @ts-ignore
		cursor: 'pointer'
	},
	closeIcon: {
		fontSize: 30,
		color: theme.white
	},
	root: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.dark
	}
})

export default GameScreen
