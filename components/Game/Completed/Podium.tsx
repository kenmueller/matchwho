import { View, StyleSheet, useWindowDimensions } from 'react-native'

import SavedPlayer from '../../../lib/game/saved/player'
import Pedestal from './Pedestal'

const INDICES = [1, 0, 2]
const COLLAPSED_INDICES = [0, 1, 2]

const GameResultsPodium = ({ players }: { players: SavedPlayer[] }) => {
	const dimensions = useWindowDimensions()

	const collapsed = dimensions.width < 350

	return (
		<View style={[styles.root, collapsed && styles.collapsed]}>
			{(collapsed ? COLLAPSED_INDICES : INDICES).map(index => (
				<Pedestal
					key={index}
					player={players[index] ?? null} // May not have enough players
					index={index}
					collapsed={collapsed}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		flexDirection: 'row'
	},
	collapsed: {
		flexDirection: 'column'
	}
})

export default GameResultsPodium
