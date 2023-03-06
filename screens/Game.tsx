import { StyleSheet, Text, View } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'

import { AppScreens } from '../navigators/App'
import theme from '../lib/theme'

const GameScreen = () => {
	const route = useRoute<RouteProp<AppScreens>>()

	return (
		<View style={styles.root}>
			<Text style={styles.text}>Game code: {route.params!.code}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.dark
	},
	text: {
		color: theme.white
	}
})

export default GameScreen
