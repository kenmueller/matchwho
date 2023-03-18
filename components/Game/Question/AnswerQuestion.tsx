import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
	Text,
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Platform
} from 'react-native'

import GameStreamContext from '../../../lib/game/context/stream'
import GameContext from '../../../lib/game/context'
import theme from '../../../lib/theme'
import alertError from '../../../lib/error/alert'
import Message from '../Message'
import MAX_ANSWER_LENGTH from '../../../lib/game/answer'

const GameAnswerQuestion = () => {
	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)
	if (!(gameStream && game)) return null

	const input = useRef<TextInput | null>(null)

	const [answer, setAnswer] = useState('')
	const normalizedAnswer = answer.trim()

	const [answering, setAnswering] = useState(false)
	const disabled = !normalizedAnswer

	const submit = useCallback(() => {
		try {
			setAnswering(true)
			gameStream.send({ key: 'answer', value: normalizedAnswer })
		} catch (error) {
			setAnswering(false)
			alertError(error)
		}
	}, [normalizedAnswer, gameStream, setAnswering])

	useEffect(() => {
		input.current?.focus()
	}, [input])

	return !game.self ? (
		<Message
			title={`Players are answering ${
				game.turn?.player.name ?? '(error)'
			}'s question`}
			description={game.turn?.question ?? '(error)'}
		/>
	) : game.self?.answer ? (
		<Message title="Waiting for other players to answer">
			<View style={styles.self}>
				<Text style={styles.selfQuestion}>
					{game.turn?.question ?? '(error)'}
				</Text>
				<Text style={styles.selfAnswer}>{game.self.answer}</Text>
			</View>
		</Message>
	) : (
		<View style={styles.root}>
			<Text style={styles.asker}>{game.turn?.player.name} asked</Text>
			<Text style={styles.question}>
				{game.turn?.question ?? '(error)'}
			</Text>
			<TextInput
				ref={current => (input.current = current)}
				value={answer}
				placeholder="Answer"
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

const styles = StyleSheet.create({
	self: {
		alignItems: 'flex-start',
		width: '100%',
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 2,
		borderTopColor: theme.gray
	},
	selfQuestion: {
		fontSize: 22,
		fontWeight: '700',
		color: theme.white
	},
	selfAnswer: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	root: {
		alignItems: 'center',
		width: '100%',
		maxWidth: 600
	},
	asker: {
		alignSelf: 'flex-start',
		fontSize: 18,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	question: {
		alignSelf: 'flex-start',
		marginTop: 8,
		fontSize: 22,
		fontWeight: '700',
		color: theme.white
	},
	input: {
		maxWidth: '100%',
		width: 500,
		marginTop: 16,
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
	submit: {
		marginTop: 12,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	submitText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	disabled: {
		opacity: 0.5
	}
})

export default GameAnswerQuestion
