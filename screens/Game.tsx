import { useState, useContext, useCallback, useEffect } from 'react'
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
import createGameStream from '../lib/api/gameStream'
import GameState from '../lib/game/state'
import gameMetaStatus from '../lib/game/metaStatus'
import { GameScreens } from '../navigators/Game'
import JoinGame from '../components/Game/Join'
import GameStreamContext from '../lib/game/context/stream'
import GameContext from '../lib/game/context'
import GameView from '../components/Game/View'
import GameMeta from '../lib/game/meta'
import gameMeta from '../lib/api/gameMeta'
import alertError from '../lib/error/alert'
import HttpError from '../lib/error/http'
import ErrorCode from '../lib/error/code'

const GameScreen = () => {
	const navigation =
		useNavigation<
			CompositeNavigationProp<
				DrawerNavigationProp<GameScreens, 'GameInternal'>,
				StackNavigationProp<AppScreens, 'Game'>
			>
		>()

	const { code } = useRoute<RouteProp<GameScreens, 'GameInternal'>>().params
	const [meta, setMeta] = useState<GameMeta | null>(null)

	const [gameStream, setGameStream] = useContext(GameStreamContext)
	const [game, setGame] = useContext(GameContext)

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
							StackActions.replace('Game', { code: data.value })
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
		gameMeta(code)
			.then(setMeta)
			.catch(() => {
				console.log('catch')
				alertError(
					new HttpError(ErrorCode.NotFound, 'Invalid game code')
				)
				navigation.dispatch(StackActions.replace('Home'))
			})
	}, [navigation, code, setMeta])

	useEffect(() => {
		// Spectate if game has already started
		if (meta && meta.state !== GameState.Joining) join(null)
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
				meta
					? gameStream && game
						? 'Game running'
						: gameMetaStatus(meta)
					: 'Loading...'
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
				// Only allow opening of the sidebar if you've joined the game on mobile
				Platform.OS !== 'web' &&
				game && (
					<TouchableOpacity
						onPress={showPlayers}
						style={styles.players}
					>
						<MaterialIcons
							name="people"
							style={styles.playersIcon}
						/>
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
			{meta ? (
				gameStream && game ? (
					<GameView />
				) : meta.state === GameState.Joining ? (
					<JoinGame joining={joining} join={join} />
				) : /* Joining as a spectator */ null
			) : /* Loading */ null}
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
		marginLeft: 24,

		// @ts-ignore
		cursor: 'pointer'
	},
	playersIcon: {
		fontSize: 30,
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
