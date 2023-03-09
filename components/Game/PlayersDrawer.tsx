import { useContext } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'

import GameContext from '../../lib/game/context'
import theme from '../../lib/theme'

const PlayersDrawer = () => {
	const [game] = useContext(GameContext)

	return (
		<View style={styles.root}>
			<Text style={{ color: theme.white }}>{JSON.stringify(game)}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: Platform.OS === 'web' ? theme.darkGray : theme.dark
	}
})

export default PlayersDrawer
