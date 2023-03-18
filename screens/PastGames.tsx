import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import PastGameRow from '../components/Game/Past/Row'

import alertError from '../lib/error/alert'
import SavedGame from '../lib/game/saved'
import { fetchGames } from '../lib/storage/games'
import theme from '../lib/theme'

const PastGames = () => {
	const [games, setGames] = useState<SavedGame[] | null>(null)

	useEffect(() => {
		fetchGames().then(setGames).catch(alertError)
	}, [setGames])

	return (
		<View style={styles.root}>
			<FlatList
				bounces={false}
				data={games}
				keyExtractor={game => game.code}
				renderItem={({ item }) => <PastGameRow game={item} />}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: theme.dark
	}
})

export default PastGames
