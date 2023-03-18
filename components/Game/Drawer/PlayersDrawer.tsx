import { useContext } from 'react'
import { View, StyleSheet, Platform, Text, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import GameContext from '../../../lib/game/context'
import theme from '../../../lib/theme'
import PlayersDrawerRow from './PlayersDrawerRow'

const paddingVertical = 18

const GamePlayersDrawer = () => {
	const insets = useSafeAreaInsets()

	const [game] = useContext(GameContext)
	if (!game) return null

	return (
		<ScrollView
			bounces={false}
			scrollIndicatorInsets={{ right: 1 }} // Fix scrollbar bug
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={[
				styles.scrollContainer,
				{
					paddingTop: Math.max(paddingVertical, insets.top),
					paddingBottom: Math.max(paddingVertical, insets.bottom)
				}
			]}
			style={styles.scroll}
		>
			<View style={styles.inner}>
				<Text style={styles.title}>Players</Text>
				{game.players.map(player => (
					<PlayersDrawerRow key={player.id} player={player} />
				))}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollContainer: {
		width: '100%',
		flexGrow: 1
	},
	scroll: {
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
