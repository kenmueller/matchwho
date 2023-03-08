import { useContext } from 'react'
import { Text } from 'react-native'

import GameContext from '../../lib/game/context'

const PlayersDrawer = () => {
	const [game] = useContext(GameContext)

	return <Text>{JSON.stringify(game)}</Text>
}

export default PlayersDrawer
