import { GestureResponderEvent } from 'react-native'

import Point from '../../../lib/point'
import theme from '../../../lib/theme'
import Link from './Link'

const MatchLink = ({
	player,
	answer,
	positions,
	onPress
}: {
	player: string
	answer: number | { answer: number; correct: boolean }
	positions: Record<string, Point>
	onPress?: (event: GestureResponderEvent) => void
}) => {
	const answerIndex = (
		typeof answer === 'number' ? answer : answer.answer
	).toString()
	const correct = typeof answer === 'number' ? null : answer.correct

	if (!(player in positions && answerIndex in positions)) return null

	return (
		<Link
			key={player}
			from={positions[player]}
			to={positions[answerIndex]}
			color={
				correct === null ? undefined : correct ? theme.green : theme.red
			}
			onPress={onPress}
		/>
	)
}

export default MatchLink
