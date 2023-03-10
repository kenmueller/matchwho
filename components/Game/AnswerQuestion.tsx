import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
	Text,
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity
} from 'react-native'

import GameStreamContext from '../../lib/game/context/stream'
import GameContext from '../../lib/game/context'
import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'
import Message from './Message'
import MAX_ANSWER_LENGTH from '../../lib/game/answer'

const GameAnswerQuestion = () => {
	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)

	const input = useRef<TextInput | null>(null)

	const [answer, setAnswer] = useState('')

	const [answering, setAnswering] = useState(false)
	const disabled = !answer

	const submit = useCallback(() => {
		try {
			if (!gameStream) return

			setAnswering(true)
			gameStream.send({ key: 'answer', value: answer })
		} catch (error) {
			setAnswering(false)
			alertError(error)
		}
	}, [answer, gameStream, setAnswering])

	useEffect(() => {
		input.current?.focus()
	}, [input])

	if (!game) return null

	return game.self?.answer ? (
		<Message title="Waiting for other players to answer">
			<Text>{game.turn?.question ?? '(error)'}</Text>
			<Text>{game.self.answer}</Text>
		</Message>
	) : (
		<View>
			<Text>{game.turn?.player.name} asked</Text>
			<Text>{game.turn?.question ?? '(error)'}</Text>
			<TextInput
				ref={current => (input.current = current)}
				value={answer}
				placeholder="Question"
				placeholderTextColor={theme.whiteWithOpacity(0.5)}
				maxLength={MAX_ANSWER_LENGTH}
				multiline
				numberOfLines={6}
				onChangeText={setAnswer}
				style={styles.input}
			/>
			<TouchableOpacity
				disabled={answering || disabled}
				onPress={submit}
				style={[
					styles.submit,
					(answering || disabled) && styles.disabled
				]}
			>
				<Text style={styles.submitText}>Answer Question</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({})

export default GameAnswerQuestion
