import { StyleSheet, Text, View } from 'react-native'

import SavedGame from '../../../lib/game/saved'
import formatDate from '../../../lib/format/date'

const PastGameRow = ({ game }: { game: SavedGame }) => (
	<View>
		<Text>{game.code}</Text>
		<Text>{formatDate(new Date(game.ended))}</Text>
		<Text>{game.leader}</Text>
	</View>
)

const styles = StyleSheet.create({})

export default PastGameRow
