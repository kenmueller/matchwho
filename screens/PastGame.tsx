import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import alertError from '../lib/error/alert'
import SavedGame from '../lib/game/saved'
import { fetchGame } from '../lib/storage/games'
import theme from '../lib/theme'
import { AppScreens } from '../navigators/App'
import GameResults from '../components/Game/Completed/Results'
import useFixedWindowDimensions from '../lib/useFixedWindowDimensions'

const paddingVertical = 24

const PastGame = () => {
	const dimensions = useFixedWindowDimensions()
	const insets = useSafeAreaInsets()

	const navigation =
		useNavigation<StackNavigationProp<AppScreens, 'PastGame'>>()
	const route = useRoute<RouteProp<AppScreens, 'PastGame'>>()

	const { code } = route.params

	const [game, setGame] = useState<SavedGame | null>(null)

	const gameNotFound = useCallback(() => {
		alertError(new Error('Game not found'))
		navigation.replace('Home')
	}, [navigation])

	useEffect(() => {
		fetchGame(code)
			.then(newGame => {
				newGame ? setGame(newGame) : gameNotFound()
			})
			.catch(alertError)
	}, [code, setGame, gameNotFound])

	return (
		<View style={styles.root}>
			{game && (
				<ScrollView
					bounces={false}
					scrollIndicatorInsets={{ right: 1 }} // Fix scrollbar bug
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={[
						styles.scrollContainer,
						{
							paddingTop: paddingVertical,
							paddingBottom: Math.max(
								paddingVertical,
								insets.bottom
							)
						}
					]}
					style={[
						styles.scroll,
						{ paddingHorizontal: dimensions.width < 350 ? 16 : 32 }
					]}
				>
					<GameResults {...game} />
				</ScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: theme.dark
	},
	scrollContainer: {
		width: '100%',
		flexGrow: 1
	},
	scroll: {
		width: '100%',
		height: '100%'
	}
})

export default PastGame
