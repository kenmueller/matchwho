import { useContext } from 'react'
import { View, StyleSheet, Platform, Text } from 'react-native'

import GameContext from '../../lib/game/context'
import theme from '../../lib/theme'
import PlayersDrawerRow from './PlayersDrawerRow'

const PlayersDrawer = () => {
	const [game] = useContext(GameContext)

	return (
		<View style={styles.root}>
			<Text style={styles.title}>Players</Text>
			{game?.players.map((player, index) => (
				<PlayersDrawerRow
					key={player.id}
					player={player}
					index={index}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		paddingVertical: 18,
		paddingHorizontal: 24,
		backgroundColor: Platform.OS === 'web' ? theme.darkGray : theme.dark
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: theme.white
	}
})

export default PlayersDrawer
