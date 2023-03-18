import { useCallback } from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	useWindowDimensions
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import SavedGame from '../../../lib/game/saved'
import formatDate from '../../../lib/format/date'
import theme from '../../../lib/theme'
import LeaderIcon from '../../../icons/Leader'
import { AppScreens } from '../../../navigators/App'

const PastGameRow = ({ game }: { game: SavedGame }) => {
	const dimensions = useWindowDimensions()

	const navigation =
		useNavigation<StackNavigationProp<AppScreens, 'PastGames'>>()

	const viewGame = useCallback(() => {
		navigation.push('PastGame', { code: game.code })
	}, [navigation, game.code])

	return (
		<TouchableOpacity
			onPress={viewGame}
			style={[
				styles.root,
				{ paddingHorizontal: dimensions.width < 350 ? 0 : 16 }
			]}
		>
			<View>
				<Text style={styles.code}>{game.code}</Text>
				<Text style={styles.date}>
					{formatDate(new Date(game.ended))}
				</Text>
			</View>
			<View style={styles.leader}>
				<Text numberOfLines={1} style={styles.leaderName}>
					{game.leader}
				</Text>
				<LeaderIcon fill={theme.yellow} style={styles.leaderIcon} />
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 16
	},
	code: {
		fontSize: 16,
		fontWeight: '700',
		color: theme.white
	},
	date: {
		marginTop: 8,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	leader: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	leaderName: {
		maxWidth: 100,
		fontSize: 16,
		fontWeight: '700',
		color: theme.yellow
	},
	leaderIcon: {
		width: 24,
		height: 18,
		marginLeft: 8
	}
})

export default PastGameRow
