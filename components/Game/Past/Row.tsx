import { StyleSheet, Text, View } from 'react-native'

import SavedGame from '../../../lib/game/saved'

const PastGameRow = ({ game }: { game: SavedGame }) => (
	<View>
		<Text>{game.code}</Text>
	</View>
)

const styles = StyleSheet.create({})

export default PastGameRow
