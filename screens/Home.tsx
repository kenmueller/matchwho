import { useState, useCallback } from 'react'
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
	TouchableOpacity
} from 'react-native'
import { useNavigation, StackActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { AppScreens } from '../navigators/App'
import MatchIcon from '../icons/Match'
import gameExists from '../lib/api/gameExists'
import alertError from '../lib/error/alert'
import ErrorCode from '../lib/error/code'
import HttpError from '../lib/error/http'
import CODE_LENGTH from '../lib/game/code'
import theme from '../lib/theme'
import createGame from '../lib/api/createGame'

const HomeScreen = () => {
	const navigation = useNavigation<StackNavigationProp<AppScreens, 'Home'>>()

	const [code, setCode] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const normalizedCode = code.toLowerCase()
	const isJoinDisabled = code.length !== CODE_LENGTH

	const join = useCallback(async () => {
		try {
			setIsLoading(true)

			const exists = gameExists(normalizedCode)
			if (!exists)
				throw new HttpError(ErrorCode.NotFound, 'Game not found')

			navigation.dispatch(
				StackActions.replace('Game', { code: normalizedCode })
			)
		} catch (error) {
			setIsLoading(false)
			alertError(error)
		}
	}, [navigation, normalizedCode, setIsLoading])

	const create = useCallback(async () => {
		try {
			setIsLoading(true)

			const newCode = await createGame()

			navigation.dispatch(StackActions.replace('Game', { code: newCode }))
		} catch (error) {
			setIsLoading(false)
			alertError(error)
		}
	}, [navigation, setIsLoading])

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.root}
		>
			<TouchableWithoutFeedback
				onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
			>
				<View style={styles.container}>
					<View style={styles.title}>
						<MatchIcon
							fill={theme.white}
							style={styles.titleIcon}
						/>
						<Text style={styles.titleText}>Match Who</Text>
					</View>
					<View style={styles.main}>
						<TextInput
							value={code}
							autoCorrect={false}
							maxLength={CODE_LENGTH}
							placeholder="Game code"
							placeholderTextColor={theme.whiteWithOpacity(0.5)}
							onChangeText={setCode}
							style={styles.joinInput}
						/>
						<TouchableOpacity
							disabled={isLoading || isJoinDisabled}
							onPress={join}
							style={[
								styles.join,
								(isLoading || isJoinDisabled) && styles.disabled
							]}
						>
							<Text style={styles.joinText}>Join Game</Text>
						</TouchableOpacity>
						<View style={styles.divider} />
						<TouchableOpacity
							disabled={isLoading}
							onPress={create}
							style={[
								styles.create,
								isLoading && styles.disabled
							]}
						>
							<Text style={styles.createText}>Create Game</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		backgroundColor: theme.dark
	},
	container: {
		width: '100%',
		height: '100%',
		alignItems: 'center'
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 80
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
	main: {
		maxWidth: 300,
		width: '100%',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	joinInput: {
		width: '100%',
		paddingVertical: 8,
		paddingHorizontal: 16,
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow,
		backgroundColor: theme.yellowWithOpacity(0.1),
		borderWidth: 2,
		borderColor: theme.yellow,
		borderRadius: 16,
		outlineStyle: 'none'
	},
	join: {
		marginTop: 16,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	joinText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	divider: {
		width: '100%',
		height: 2,
		marginVertical: 20,
		backgroundColor: theme.gray,
		borderRadius: 1
	},
	create: {
		paddingVertical: 20,
		paddingHorizontal: 30,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	createText: {
		fontSize: 22,
		fontWeight: '700',
		color: theme.yellow
	},
	disabled: {
		opacity: 0.5
	}
})

export default HomeScreen
