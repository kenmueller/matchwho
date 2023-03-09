import { useEffect, useCallback, useRef, useState, useContext } from 'react'
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	TextInput
} from 'react-native'

import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'
import GameStreamContext from '../../lib/game/context/stream'
import MAX_QUESTION_LENGTH from '../../lib/game/question'

const GameAskQuestion = () => {
	const [gameStream] = useContext(GameStreamContext)

	const input = useRef<TextInput | null>(null)

	const [question, setQuestion] = useState('')

	const [asking, setAsking] = useState(false)
	const disabled = !question

	const ask = useCallback(() => {
		try {
			if (!gameStream) return

			setAsking(true)
			gameStream.send({ key: 'question', value: question })
		} catch (error) {
			setAsking(false)
			alertError(error)
		}
	}, [gameStream, setAsking])

	useEffect(() => {
		input.current?.focus()
	}, [input])

	return (
		<View style={styles.root}>
			<TextInput
				ref={current => (input.current = current)}
				value={question}
				placeholder="Question"
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
	root: {},
	input: {},
	ask: {},
	askText: {},
	disabled: {
		opacity: 0.5
	}
})

export default GameAskQuestion
