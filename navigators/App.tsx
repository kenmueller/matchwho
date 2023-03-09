import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'
import GameNavigator from './Game'

export type AppScreens = {
	Home: undefined
	Game: { code: string }
}

const Stack = createStackNavigator<AppScreens>()

const AppNavigator = () => (
	<Stack.Navigator
		initialRouteName="Home"
		screenOptions={{ title: 'Match Who', headerShown: false }}
	>
		<Stack.Screen name="Home" component={HomeScreen} />
		<Stack.Screen name="Game" component={GameNavigator} />
	</Stack.Navigator>
)

export default AppNavigator
