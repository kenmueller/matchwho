import { View, StyleSheet } from 'react-native'

import SavedPlayer from '../../../lib/game/saved/player'
import Pedestal from './Pedestal'

const GameResultsPodium = ({
	player,
	index
}: {
	player: SavedPlayer
	index: number
}) => <View style={styles.root}></View>

const styles = StyleSheet.create({
	root: {}
})

export default GameResultsPodium
