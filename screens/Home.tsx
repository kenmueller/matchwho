import { useCallback, useEffect, useRef, useState } from 'react'
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
	TouchableOpacity,
	ScrollView,
	useWindowDimensions,
	Animated
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppScreens } from '../navigators/App'
import MatchIcon from '../icons/Match'
import theme from '../lib/theme'
import HomeMainContent from '../components/Home/Main'
import Apps from '../components/Home/Apps'

const shouldSetResponder = () => true
const paddingVertical = 80

const HomeScreen = () => {
	const dimensions = useWindowDimensions()
	const insets = useSafeAreaInsets()

	const navigation = useNavigation<StackNavigationProp<AppScreens, 'Home'>>()

	const [isKeyboardShowing, setIsKeyboardShowing] = useState(false)

	const defaultPaddingBottom = Math.max(paddingVertical, insets.bottom)
	const paddingBottom = useRef(new Animated.Value(defaultPaddingBottom))

	useEffect(() => {
		const showSubscription = Keyboard.addListener(
			'keyboardWillShow',
			() => {
				setIsKeyboardShowing(true)

				Animated.timing(paddingBottom.current, {
					toValue: 0,
					useNativeDriver: false
				}).start()
			}
		)

		const hideSubscription = Keyboard.addListener(
			'keyboardWillHide',
			() => {
				setIsKeyboardShowing(false)

				Animated.timing(paddingBottom.current, {
					toValue: defaultPaddingBottom,
					useNativeDriver: false
				}).start()
			}
		)

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [setIsKeyboardShowing, defaultPaddingBottom, paddingBottom])

	const viewPastGames = useCallback(() => {
		navigation.push('PastGames')
	}, [navigation])

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.root}
		>
			<TouchableWithoutFeedback
				onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
			>
				<View style={styles.rootContainer}>
					<ScrollView
						bounces={false}
						contentContainerStyle={styles.scrollContainer}
						style={styles.scroll}
					>
						<Animated.View
							onStartShouldSetResponder={shouldSetResponder}
							style={[
								styles.container,
								{
									paddingTop: paddingVertical,
									paddingBottom: paddingBottom.current,
									paddingHorizontal:
										dimensions.width < 350 ? 16 : 32
								}
							]}
						>
							<View style={styles.title}>
								<MatchIcon
									fill={theme.white}
									style={styles.titleIcon}
								/>
								<Text style={styles.titleText}>Match Who</Text>
							</View>
							<HomeMainContent />
							{!isKeyboardShowing && (
								<TouchableOpacity
									onPress={viewPastGames}
									style={styles.pastGames}
								>
									<Text style={styles.pastGamesText}>
										View Past Games
									</Text>
								</TouchableOpacity>
							)}
						</Animated.View>
					</ScrollView>
					{Platform.OS === 'web' && <Apps />}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: theme.dark
	},
	rootContainer: {
		position: 'relative',
		width: '100%',
		height: '100%'
	},
	scrollContainer: {
		width: '100%',
		flexGrow: 1
	},
	scroll: {
		width: '100%',
		height: '100%'
	},
	container: {
		width: '100%',
		height: '100%',
		alignItems: 'center'
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	titleIcon: {
		width: 48,
		height: 57
	},
	titleText: {
		marginLeft: 16,
		fontSize: 28,
		fontWeight: '700',
		color: theme.white
	},
	pastGames: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.darkGray,
		borderRadius: 16
	},
	pastGamesText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.white
	}
})

export default HomeScreen
