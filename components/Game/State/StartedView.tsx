import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import GameContext from '../../../lib/game/context'
import GameTurnState from '../../../lib/game/turn/state'
import Message from '../Message'
import AskQuestion from '../Question/AskQuestion'
import AnswerQuestion from '../Question/AnswerQuestion'
import MatchAnswers from '../Match/MatchAnswers'

const GameStartedView = () => {
	const [game] = useContext(GameContext)
	if (!game) return null

	const myTurn = game.turn && game.turn.player.id === game.self?.id

	return (
		<View style={styles.root}>
			{game.turn ? (
				<>
					{game.turn.state === GameTurnState.Waiting &&
						(myTurn ? (
							<AskQuestion />
						) : (
							<Message
								title={`${game.turn.player.name} is thinking of a question`}
							/>
						))}
					{game.turn.state === GameTurnState.Answering &&
						(myTurn ? (
							<Message
								title="Players are answering your question"
								description={game.turn.question ?? '(error)'}
							/>
						) : (
							<AnswerQuestion />
						))}
					{game.turn.state === GameTurnState.Matching && (
						<MatchAnswers />
					)}
				</>
			) : (
				<Message error title="An unknown error occurred" />
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 'auto',
		width: '100%'
	}
})

export default GameStartedView
