import { useContext } from 'react'
import {
	View,
	StyleSheet,
	Platform,
	Text,
	ScrollView,
	useWindowDimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import GameContext from '../../lib/game/context'
import theme from '../../lib/theme'
import PlayersDrawerRow from './PlayersDrawerRow'

const paddingVertical = 18

const GamePlayersDrawer = () => {
	const dimensions = useWindowDimensions()
	const insets = useSafeAreaInsets()

	const [game] = useContext(GameContext)

	return (
		<ScrollView
			contentContainerStyle={[
				styles.rootContainer,
				{
					height:
						Platform.OS === 'web'
							? /* Fixes scrollview height to parent height */
							  0
							: dimensions.height
				}
			]}
			style={[
				styles.root,
				{
					paddingTop: Math.max(paddingVertical, insets.top),
					paddingBottom: Math.max(paddingVertical, insets.bottom)
				}
			]}
		>
			<View style={styles.inner}>
				<Text style={styles.title}>Players</Text>
				{game?.players.map(player => (
					<PlayersDrawerRow key={player.id} player={player} />
				))}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	rootContainer: {
		width: '100%'
	},
	root: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 24,
		backgroundColor: Platform.OS === 'web' ? theme.darkGray : theme.dark
	},
	inner: {
		paddingBottom: 24
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: theme.white
	}
})

export default GamePlayersDrawer
