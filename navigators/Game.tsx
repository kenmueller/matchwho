import { Text } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import GameScreen from '../screens/Game'
import GameMeta from '../lib/game/meta'
import { AppScreens } from './App'
import theme from '../lib/theme'

export type GameScreens = {
	GameInternal: {
		code: string
		meta: GameMeta
	}
}

const Drawer = createDrawerNavigator<GameScreens>()

const GameNavigator = () => {
	const route = useRoute<RouteProp<AppScreens, 'Game'>>()

	return (
		<Drawer.Navigator
			initialRouteName="GameInternal"
			drawerContent={() => <Text>Hello</Text>}
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
	)
}

export default GameNavigator
