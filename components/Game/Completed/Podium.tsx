import { View, StyleSheet } from 'react-native'

import SavedPlayer from '../../../lib/game/saved/player'
import Pedestal from './Pedestal'

const INDICES = [1, 0, 2]

const GameResultsPodium = ({ players }: { players: SavedPlayer[] }) => (
	<View style={styles.root}>
		{INDICES.map(index => (
			<Pedestal key={index} player={players[index]} index={index} />
		))}
	</View>
)

const styles = StyleSheet.create({
	root: {
		width: '100%',
		flexDirection: 'row'
	}
})

export default GameResultsPodium
