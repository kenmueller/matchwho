import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'
import GameScreen from '../screens/Game'
import GameMeta from '../lib/game/meta'

export type AppScreens = {
	Home: undefined
	Game: {
		code: string
		meta: GameMeta
	}
}

const Stack = createStackNavigator<AppScreens>()

const AppNavigator = () => (
	<Stack.Navigator
		initialRouteName="Home"
		screenOptions={{ title: 'Match Who', headerShown: false }}
	>
		<Stack.Screen name="Home" component={HomeScreen} />
		<Stack.Screen name="Game" component={GameScreen} />
	</Stack.Navigator>
)

export default AppNavigator
