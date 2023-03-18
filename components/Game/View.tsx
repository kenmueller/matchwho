import { useContext, useRef } from 'react'
import {
	Text,
	View,
	StyleSheet,
	Platform,
	ScrollView,
	useWindowDimensions
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

const paddingVertical = 24

const GameView = () => {
	const dimensions = useWindowDimensions()
	const insets = useSafeAreaInsets()

	const [game] = useContext(GameContext)
	if (!game) return null

	const scrollView = useRef<ScrollView | null>(null)

	const isKeyboardShowing = useKeyboard({
		showEvent: 'keyboardWillShow',
		hideEvent: 'keyboardWillHide'
	})

	return (
		<>
			{!game.self && <Text style={styles.spectating}>spectating</Text>}
			<ScrollView
				ref={current => (scrollView.current = current)}
				bounces={false}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={[
					styles.scrollContainer,
					{
						paddingTop: paddingVertical,
						paddingBottom: Math.max(paddingVertical, insets.bottom)
					}
				]}
				style={styles.scroll}
			>
				<View
					onStartShouldSetResponder={() => !isKeyboardShowing}
					style={[
						styles.container,
						{ paddingHorizontal: dimensions.width < 350 ? 16 : 32 }
					]}
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
		</>
	)
}

const styles = StyleSheet.create({
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
	}
})

export default GameView
