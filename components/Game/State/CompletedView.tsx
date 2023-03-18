import { useContext } from 'react'
import { Text } from 'react-native'

import GameContext from '../../../lib/game/context'
import GameResults from '../Completed/Results'

const GameCompletedView = () => {
	const [game] = useContext(GameContext)
	if (!game) return null

	return (
		<>
			<GameResults
				players={game.results?.players ?? []}
				questions={game.results?.questions ?? []}
			/>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
			<Text style={{ color: 'white' }}>bye</Text>
		</>
	)
}

export default GameCompletedView
