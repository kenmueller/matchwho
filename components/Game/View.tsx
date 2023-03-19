import { useContext, useRef, useState, useCallback } from 'react'
import {
	Text,
	View,
	StyleSheet,
	Platform,
	ScrollView,
	TouchableOpacity
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import theme from '../../lib/theme'
import GameContext from '../../lib/game/context'
import gameStatus from '../../lib/game/status'
import GameState from '../../lib/game/state'
import ROUNDS from '../../lib/game/rounds'
import JoiningView from './State/JoiningView'
import StartedView from './State/StartedView'
import CompletedView from './State/CompletedView'
import ScrollViewContext from '../../lib/scrollView/context'
import useKeyboard from '../../lib/useKeyboard'
import GameStreamContext from '../../lib/game/context/stream'
import alertError from '../../lib/error/alert'
import useFixedWindowDimensions from '../../lib/useFixedWindowDimensions'

const paddingVertical = 24
const completedVerticalPadding = 8

const GameView = () => {
	const dimensions = useFixedWindowDimensions()
	const insets = useSafeAreaInsets()

	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)
	if (!(gameStream && game)) return null

	const scrollView = useRef<ScrollView | null>(null)

	const isKeyboardShowing = useKeyboard({
		showEvent: 'keyboardWillShow',
		hideEvent: 'keyboardWillHide'
	})

	const isCompletedShowing =
		Platform.OS !== 'web' && game.state === GameState.Completed

	const paddingHorizontal = dimensions.width < 350 ? 16 : 32

	const leader = game?.leader
	const isLeader = leader && leader.id === game.self?.id

	const [startingNext, setStartingNext] = useState(false)

	const startNext = useCallback(() => {
		try {
			if (!gameStream) return

			setStartingNext(true)
			gameStream.send({ key: 'next' })
		} catch (error) {
			setStartingNext(false)
			alertError(error)
		}
	}, [gameStream, setStartingNext])

	return (
		<View style={styles.root}>
			{!game.self && <Text style={styles.spectating}>spectating</Text>}
			<ScrollView
				ref={current => (scrollView.current = current)}
				bounces={false}
				scrollIndicatorInsets={{ right: 1 }} // Fix scrollbar bug
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={[
					styles.scrollContainer,
					{
						paddingTop: paddingVertical,
						paddingBottom: isCompletedShowing
							? paddingVertical - completedVerticalPadding
							: Math.max(paddingVertical, insets.bottom)
					}
				]}
				style={styles.scroll}
			>
				<View
					onStartShouldSetResponder={() => !isKeyboardShowing}
					style={[styles.container, { paddingHorizontal }]}
				>
					<ScrollViewContext.Provider value={scrollView}>
						{game.state === GameState.Started && (
							<Text style={styles.rounds}>
								Round {game.round}/{ROUNDS}
							</Text>
						)}
						<Text style={styles.status}>{gameStatus(game)}</Text>
						{game.state === GameState.Joining && <JoiningView />}
						{game.state === GameState.Started && <StartedView />}
						{game.state === GameState.Completed && (
							<CompletedView />
						)}
					</ScrollViewContext.Provider>
				</View>
			</ScrollView>
			{isCompletedShowing && (
				<View
					style={{
						paddingTop: completedVerticalPadding,
						paddingBottom: Math.max(paddingVertical, insets.bottom),
						paddingHorizontal
					}}
				>
					{isLeader ? (
						<TouchableOpacity
							disabled={startingNext}
							onPress={startNext}
							style={[
								styles.startNext,
								startingNext && styles.disabled
							]}
						>
							<Text style={styles.startNextText}>
								Start Next Game
							</Text>
						</TouchableOpacity>
					) : (
						<Text style={styles.waitingNext}>
							Waiting{' '}
							{leader ? `for ${leader.name}asdfasdfasfsadf ` : ''}
							to start the next game
						</Text>
					)}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
		alignItems: 'center'
	},
	scrollContainer: {
		width: '100%',
		flexGrow: 1
	},
	scroll: {
		width: '100%',
		height: '100%'
	},
	container: {
		width: '100%',
		height: '100%'
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
		marginBottom: 20,
		fontSize: Platform.OS === 'web' ? 30 : 24,
		fontWeight: '900',
		color: theme.white
	},
	startNext: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 18,
		...(Platform.OS === 'web' ? { cursor: 'pointer' } : {})
	},
	startNextText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	waitingNext: {
		fontSize: 16,
		fontWeight: '700',
		color: theme.white
	},
	disabled: {
		opacity: 0.5
	}
})

export default GameView
