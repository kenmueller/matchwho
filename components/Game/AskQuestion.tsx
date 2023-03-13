import { useEffect, useCallback, useRef, useState, useContext } from 'react'
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	TextInput,
	Platform
} from 'react-native'

import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'
import GameStreamContext from '../../lib/game/context/stream'
import MAX_QUESTION_LENGTH from '../../lib/game/question'

const GameAskQuestion = () => {
	const [gameStream] = useContext(GameStreamContext)
	if (!gameStream) return null

	const input = useRef<TextInput | null>(null)

	const [question, setQuestion] = useState('')
	const normalizedQuestion = question.trim()

	const [asking, setAsking] = useState(false)
	const disabled = !normalizedQuestion

	const ask = useCallback(() => {
		try {
			setAsking(true)
			gameStream.send({ key: 'question', value: normalizedQuestion })
		} catch (error) {
			setAsking(false)
			alertError(error)
		}
	}, [normalizedQuestion, gameStream, setAsking])

	useEffect(() => {
		input.current?.focus()
	}, [input])

	return (
		<View style={styles.root}>
			<TextInput
				ref={current => (input.current = current)}
				value={question}
				placeholder="Question"
				placeholderTextColor={theme.whiteWithOpacity(0.5)}
				maxLength={MAX_QUESTION_LENGTH}
				multiline
				numberOfLines={6}
				onChangeText={setQuestion}
				style={styles.input}
			/>
			<TouchableOpacity
				disabled={asking || disabled}
				onPress={ask}
				style={[styles.ask, (asking || disabled) && styles.disabled]}
			>
				<Text style={styles.askText}>Ask Question</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		alignItems: 'center'
	},
	input: {
		maxWidth: '100%',
		width: 500,
		paddingVertical: 8,
		paddingHorizontal: 16,
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow,
		backgroundColor: theme.yellowWithOpacity(0.1),
		borderWidth: 2,
		borderColor: theme.yellow,
		borderRadius: 16,
		textAlignVertical: 'top',
		...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
	},
	ask: {
		marginTop: 12,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	askText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	disabled: {
		opacity: 0.5
	}
})

export default GameAskQuestion
