import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'
import GameScreen from '../screens/Game'

export type AppScreens = {
	Home: undefined
	Game: { code: string }
}

const Stack = createStackNavigator<AppScreens>()

const AppNavigator = () => (
	<Stack.Navigator initialRouteName="Home">
		<Stack.Screen
			name="Home"
			component={HomeScreen}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="Game"
			component={GameScreen}
			options={{ headerShown: false }}
		/>
	</Stack.Navigator>
)

export default AppNavigator
