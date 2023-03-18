import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import alertError from '../lib/error/alert'
import SavedGame from '../lib/game/saved'
import { fetchGames } from '../lib/storage/games'
import theme from '../lib/theme'
import PastGameRow from '../components/Game/Past/Row'

const paddingVertical = 16

const PastGames = () => {
	const insets = useSafeAreaInsets()

	const [games, setGames] = useState<SavedGame[] | null>(null)

	useEffect(() => {
		fetchGames().then(setGames).catch(alertError)
	}, [setGames])

	return (
		<View style={styles.root}>
			<FlatList
				bounces={false}
				scrollIndicatorInsets={{ right: 1 }} // Fix scrollbar bug
				data={games}
				keyExtractor={game => game.code}
				renderItem={({ item }) => <PastGameRow game={item} />}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				contentContainerStyle={[
					styles.listContainer,
					{
						paddingTop: paddingVertical,
						paddingBottom: Math.max(paddingVertical, insets.bottom)
					}
				]}
				style={styles.list}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: theme.dark
	},
	listContainer: {
		width: '100%',
		flexGrow: 1
	},
	list: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 16
	},
	separator: {
		width: '100%',
		height: 2,
		backgroundColor: theme.gray,
		borderRadius: 1
	}
})

export default PastGames
