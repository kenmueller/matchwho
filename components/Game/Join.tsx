import { useState, useCallback } from 'react'
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	StyleSheet
} from 'react-native'

import theme from '../../lib/theme'
import MAX_NAME_LENGTH from '../../lib/game/name'

const JoinGame = ({
	joining,
	join
}: {
	joining: boolean
	join: (name: string) => void
}) => {
	const [name, setName] = useState('')
	const disabled = !name

	const submit = useCallback(() => {
		join(name)
	}, [join, name])

	return (
		<View style={styles.root}>
			<TextInput
				value={name}
				placeholder="Name"
				placeholderTextColor={theme.yellowWithOpacity(0.5)}
				maxLength={MAX_NAME_LENGTH}
				onChangeText={setName}
				style={styles.input}
			/>
			<TouchableOpacity
				disabled={joining || disabled}
				onPress={submit}
				style={[styles.join, (joining || disabled) && styles.disabled]}
			>
				<Text style={styles.joinText}>Join Game</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		maxWidth: 300,
		width: '100%',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	input: {
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
	disabled: {
		opacity: 0.5
	}
})

export default JoinGame
