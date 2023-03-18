import { View, StyleSheet, Text } from 'react-native'

import SavedPlayer from '../../../lib/game/saved/player'
import PointIcon from '../../../icons/Point'
import theme from '../../../lib/theme'
import Bounds from '../../../lib/bounds'

const GameResultsPodium = ({
	player,
	index,
	collapsed = false,
	bounds
}: {
	player: SavedPlayer | null
	index: number
	collapsed?: boolean
	bounds: Bounds
}) => {
	const first = index === 0

	return !player && collapsed ? null : (
		<View
			style={[
				styles.root,
				{
					width: collapsed
						? '100%'
						: bounds.width < 400
						? 100
						: bounds.width < 600
						? 120
						: 200,
					marginTop: collapsed
						? first
							? 0
							: 12
						: first
						? bounds.width < 400
							? 30
							: bounds.width < 600
							? 40
							: 60
						: 0
				}
			]}
		>
			<Text
				numberOfLines={1}
				style={[styles.name, first && styles.first]}
			>
				{player?.name}
			</Text>
			<View style={styles.info}>
				<Text style={[styles.rank, first && styles.first]}>
					{player && `#${index + 1}`}
				</Text>
				<View style={styles.points}>
					{player && (
						<>
							<PointIcon
								fill={first ? theme.yellow : theme.white}
								style={styles.pointsIcon}
							/>
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
	root: {
		alignItems: 'center'
	},
	name: {
		maxWidth: '100%',
		height: 24,
		fontSize: 18,
		fontWeight: '700',
		color: theme.white
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: theme.gray
	},
	rank: {
		fontSize: 16,
		fontWeight: '700',
		color: theme.white
	},
	points: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	pointsIcon: {
		width: 18.83,
		height: 18
	},
	pointsValue: {
		marginLeft: 4,
		fontSize: 16,
		fontWeight: '700',
		color: theme.white
	},
	pointsSpacer: {
		height: 18
	},
	first: {
		color: theme.yellow
	}
})

export default GameResultsPodium
