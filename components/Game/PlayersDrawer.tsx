import { useContext } from 'react'
import { View, StyleSheet, Platform, Text, ScrollView } from 'react-native'

import GameContext from '../../lib/game/context'
import theme from '../../lib/theme'
import PlayersDrawerRow from './PlayersDrawerRow'

const PlayersDrawer = () => {
	const [game] = useContext(GameContext)

	return (
		<ScrollView
			contentContainerStyle={styles.rootContainer}
			style={styles.root}
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
		width: '100%',

		// Fixes scrollview height to parent height
		height: 0
	},
	root: {
		width: '100%',
		height: '100%',
		paddingVertical: 18,
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

export default PlayersDrawer
