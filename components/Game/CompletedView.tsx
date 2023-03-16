import { useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'

import GameContext from '../../lib/game/context'

import theme from '../../lib/theme'

const GameCompletedView = () => {
	const [game] = useContext(GameContext)
	if (!game) return null

	const results = game.results
	if (!results) return null

	return (
		<View style={styles.root}>
			<Text style={styles.questionsTitle}>Questions</Text>
			{results.questions.map(({ name, question, answers }, index) => (
				<View key={index} style={styles.question}>
					<Text style={styles.asker}>{name} asked</Text>
					<Text style={styles.questionTitle}>{question}</Text>
					{answers.map(({ name, answer }, index) => (
						<Text key={index} style={styles.answer}>
							<Text style={styles.answerName}>{name}:</Text>{' '}
							{answer}
						</Text>
					))}
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%'
	},
	questionsTitle: {
		fontSize: 30,
		fontWeight: '700',
		color: theme.white
	},
	question: {
		marginTop: 24
	},
	asker: {
		fontSize: 18,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	questionTitle: {
		marginTop: 4,
		fontSize: 24,
		fontWeight: '700',
		color: theme.white
	},
	answer: {
		marginTop: 8,
		fontSize: 16,
		color: theme.white
	},
	answerName: {
		fontWeight: '700'
	}
})

export default GameCompletedView
