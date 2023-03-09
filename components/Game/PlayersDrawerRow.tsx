import { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import LeaderIcon from '../../icons/Leader'
import PointIcon from '../../icons/Point'
import GameContext from '../../lib/game/context'
import Player from '../../lib/game/player'
import GameState from '../../lib/game/state'
import theme from '../../lib/theme'

const GamePlayersDrawerRow = ({ player }: { player: Player }) => {
	const [game] = useContext(GameContext)
	if (!game) return null

	const leader = game.leader?.id === player.id
	const self = game.self?.id === player.id
	const turn =
		game.state === GameState.Started && game.turn?.player.id === player.id
	const done = player.answered

	const fill = turn ? theme.yellow : done ? theme.blue : theme.white

	return (
		<View style={styles.root}>
			<View style={styles.name}>
				<Text
					style={[
						styles.nameValue,
						turn && styles.turn,
						done && styles.done
					]}
				>
					{player.name}
				</Text>
				{leader && <LeaderIcon fill={fill} style={styles.nameLeader} />}
				{self && (
					<Text
						style={[
							styles.nameSelf,
							turn && styles.turn,
							done && styles.done
						]}
					>
						(you)
					</Text>
				)}
			</View>
			<View style={styles.points}>
				<PointIcon fill={fill} style={styles.pointsIcon} />
				<Text
					style={[
						styles.pointsValue,
						turn && styles.turn,
						done && styles.done
					]}
				>
					{player.points}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 18,
		paddingTop: 18,
		borderTopWidth: 2,
		borderTopColor: theme.gray
	},
	name: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	nameValue: {
		fontWeight: '700',
		color: theme.white
	},
	nameLeader: {
		width: 24,
		height: 18,
		marginLeft: 8
	},
	nameSelf: {
		marginLeft: 8,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
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
		marginLeft: 8,
		fontWeight: '700',
		color: theme.white
	},
	turn: {
		color: theme.yellow
	},
	done: {
		color: theme.blue
	}
})

export default GamePlayersDrawerRow
