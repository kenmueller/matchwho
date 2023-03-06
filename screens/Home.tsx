import { useState } from 'react'
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

import MatchIcon from '../icons/Match'
import CODE_LENGTH from '../lib/game/code'
import theme from '../lib/theme'

const HomeScreen = () => {
	const [code, setCode] = useState('')

	const isJoinDisabled = code.length !== CODE_LENGTH

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
							placeholderTextColor={theme.yellowWithOpacity(0.5)}
							onChangeText={setCode}
							style={styles.joinInput}
						/>
						<TouchableOpacity
							disabled={isJoinDisabled}
							style={[
								styles.join,
								isJoinDisabled && styles.disabled
							]}
						>
							<Text style={styles.joinText}>Join Game</Text>
						</TouchableOpacity>
						<View style={styles.divider} />
						<TouchableOpacity style={styles.create}>
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
		borderWidth: 2,
		borderColor: theme.yellow,
		borderRadius: 16
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
