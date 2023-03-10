import { useState, useContext, useCallback, useEffect } from 'react'
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View
} from 'react-native'
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
import * as Clipboard from 'expo-clipboard'

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
import gameStatus from '../lib/game/status'

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
						break
				}
			})

			setGameStream(newGameStream)
		},
		[code, navigation, setGame, setGameStream]
	)

	const copyCode = useCallback(async () => {
		await Clipboard.setStringAsync(code)

		Platform.OS === 'web'
			? alert('Copied game code to clipboard')
			: Alert.alert(
					'Copied to clipboard',
					'Share this code with your friends'
			  )
	}, [code])

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
						? gameStatus(game)
						: gameMetaStatus(meta)
					: 'Loading...'
			} | Match Who`
		})
	}, [navigation, gameStream, game, meta])

	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<TouchableOpacity onPress={copyCode}>
					<Text style={styles.title}>
						{Platform.OS === 'web' && 'Game code: '}
						<Text style={styles.titleCode}>
							{code}{' '}
							<MaterialIcons
								name="content-copy"
								style={styles.titleIcon}
							/>
						</Text>
					</Text>
				</TouchableOpacity>
			)
		})
	}, [navigation, code, copyCode])

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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.root}
		>
			<TouchableWithoutFeedback
				onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
			>
				<View style={styles.container}>
					{meta ? (
						gameStream && game ? (
							<GameView />
						) : meta.state === GameState.Joining ? (
							<JoinGame joining={joining} join={join} />
						) : /* Joining as a spectator */ null
					) : /* Loading */ null}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.white,

		// @ts-ignore
		cursor: 'pointer'
	},
	titleCode: {
		alignItems: 'center',
		color: theme.yellow
	},
	titleIcon: {
		fontSize: 20
	},
	players: {
		marginLeft: 24
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
		backgroundColor: theme.dark
	},
	container: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default GameScreen
