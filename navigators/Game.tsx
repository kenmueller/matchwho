import { useState } from 'react'
import { Platform } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import GameScreen from '../screens/Game'
import GameMeta from '../lib/game/meta'
import { AppScreens } from './App'
import theme from '../lib/theme'
import Game from '../lib/game'
import GameContext from '../lib/game/context'
import PlayersDrawer from '../components/Game/PlayersDrawer'
import { GameStream } from '../lib/api/gameStream'
import GameStreamContext from '../lib/game/context/stream'

export type GameScreens = {
	GameInternal: {
		code: string
		meta: GameMeta
	}
}

const Drawer = createDrawerNavigator<GameScreens>()

const GameNavigator = () => {
	const route = useRoute<RouteProp<AppScreens, 'Game'>>()

	const [gameStream, setGameStream] = useState<GameStream | null>(null)
	const [game, setGame] = useState<Game | null>(null)

	return (
		<GameStreamContext.Provider value={[gameStream, setGameStream]}>
			<GameContext.Provider value={[game, setGame]}>
				<Drawer.Navigator
					initialRouteName="GameInternal"
					drawerContent={PlayersDrawer}
					screenOptions={{
						drawerType:
							// Only make the drawer permanent if you've joined the game on the web
							Platform.OS === 'web' && game
								? 'permanent'
								: 'slide'
					}}
				>
					<Drawer.Screen
						name="GameInternal"
						component={GameScreen}
						initialParams={route.params}
						options={{
							headerTitleAlign: 'center',
							headerTintColor: theme.white,
							headerStyle: { backgroundColor: theme.darkGray },
							headerTitle: '',
							headerLeft: () => null,
							headerRight: () => null
						}}
					/>
				</Drawer.Navigator>
			</GameContext.Provider>
		</GameStreamContext.Provider>
	)
}

export default GameNavigator
