import { useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import GameScreen from '../screens/Game'
import GameMeta from '../lib/game/meta'
import { AppScreens } from './App'
import theme from '../lib/theme'
import Game from '../lib/game'
import GameContext from '../lib/game/context'
import PlayersDrawer from '../components/Game/PlayersDrawer'

export type GameScreens = {
	GameInternal: {
		code: string
		meta: GameMeta
	}
}

const Drawer = createDrawerNavigator<GameScreens>()

const GameNavigator = () => {
	const route = useRoute<RouteProp<AppScreens, 'Game'>>()
	const gameState = useState<Game | null>(null)

	return (
		<GameContext.Provider value={gameState}>
			<Drawer.Navigator
				initialRouteName="GameInternal"
				drawerContent={PlayersDrawer}
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
	)
}

export default GameNavigator
