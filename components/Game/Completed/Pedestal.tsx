import { View, StyleSheet, Text } from 'react-native'

import SavedPlayer from '../../../lib/game/saved/player'
import PointIcon from '../../../icons/Point'
import theme from '../../../lib/theme'

const GameResultsPodium = ({
	player,
	index,
	collapsed = false
}: {
	player: SavedPlayer | null
	index: number
	collapsed?: boolean
}) => {
	const first = index === 0

	return !player && collapsed ? null : (
		<View style={styles.root}>
			<Text style={[styles.name, first && styles.first]}>
				{player?.name}
			</Text>
			<View style={styles.info}>
				<Text style={[styles.rank, first && styles.first]}>
					{player && `#${index + 1}`}
				</Text>
				<View style={styles.points}>
					{player && (
						<>
							{/* <PointIcon
								fill={first ? theme.yellow : theme.white}
								style={styles.pointsIcon}
							/> */}
							<Text
								style={[
									styles.pointsValue,
									first && styles.first
								]}
							>
								{player.points}
							</Text>
						</>
					)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {},
	name: {},
	info: {},
	rank: {},
	points: {},
	pointsIcon: {},
	pointsValue: {},
	first: {
		color: theme.yellow
	}
})

export default GameResultsPodium
