import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'

const onMatched = (game: Game, player: Player) => {
	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	if (player.id !== current.id)
		throw new HttpError(HttpErrorCode.Socket, 'You must be the one matching')

	if (game.turn.state !== GameTurnState.Matching)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Matching is not allowed at this time'
		)

	const { answers, matches } = game.turn

	if (!answers)
		throw new HttpError(HttpErrorCode.Socket, 'Unable to load answers')

	if (!matches)
		throw new HttpError(HttpErrorCode.Socket, 'Unable to load matches')

	if (!game.matched)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Not all answers have been matched.'
		)

	/** The index after the last index of the answer. */
	const nextAnswer: Record<string, number> = {}

	game.turn.correctMatches = game.notCurrent.reduce<
		Exclude<typeof game.turn.correctMatches, null>
	>((matches, { id, answer }) => {
		if (!answer) return matches

		const index = answers.indexOf(answer, nextAnswer[answer])
		if (index < 0) return matches

		matches[id] = index
		nextAnswer[answer] = index + 1

		return matches
	}, {})

	player.points += Object.entries(matches).reduce((points, [id, index]) => {
		const player = game.players.find(player => player.id === id)
		return points + (player?.answer === answers[index] ? 1 : 0)
	}, 0)
}

export default onMatched
