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
import GameTurnState from '../../lib/game/turn/state'
import ScrollViewContext from '../../lib/scrollView/context'

const shouldSetResponder = () => true
const paddingVertical = 24

const GameView = () => {
	const dimensions = useWindowDimensions()
	const insets = useSafeAreaInsets()

	const [game] = useContext(GameContext)
	if (!game) return null

	const scrollView = useRef<ScrollView | null>(null)

	/** If matching answers or completed game. */
	const hasScrollView =
		(game.state === GameState.Started &&
			game.turn?.state === GameTurnState.Matching) ||
		game.state === GameState.Completed

	const paddingHorizontal = dimensions.width < 350 ? 16 : 32

	const internal = (
		<>
			{game.state === GameState.Started && (
				<Text style={styles.rounds}>
					Round {game.round}/{ROUNDS}
				</Text>
			)}
			<Text
				style={[styles.status, hasScrollView && { marginBottom: 20 }]}
			>
				{gameStatus(game)}
			</Text>
			{game.state === GameState.Joining && <JoiningView />}
			{game.state === GameState.Started && <StartedView />}
			{game.state === GameState.Completed && <CompletedView />}
		</>
	)

	return (
		<>
			{!game.self && <Text style={styles.spectating}>spectating</Text>}
			{hasScrollView ? (
				<ScrollView
					ref={current => (scrollView.current = current)}
					bounces={false}
					contentContainerStyle={[
						styles.scrollContainer,
						{
							paddingTop: paddingVertical,
							paddingBottom: Math.max(
								paddingVertical,
								insets.bottom
							)
						}
					]}
					style={styles.scroll}
				>
					<View
						onStartShouldSetResponder={shouldSetResponder}
						style={[styles.container, { paddingHorizontal }]}
					>
						<ScrollViewContext.Provider value={scrollView}>
							{internal}
						</ScrollViewContext.Provider>
					</View>
				</ScrollView>
			) : (
				<View
					style={[
						styles.container,
						{ paddingVertical, paddingHorizontal }
					]}
				>
					{internal}
				</View>
			)}
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
		fontSize: Platform.OS === 'web' ? 30 : 24,
		fontWeight: '900',
		color: theme.white
	}
})

export default GameView
