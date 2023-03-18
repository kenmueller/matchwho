import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'
import GameNavigator from './Game'
import PastGames from '../screens/PastGames'
import HEADER_OPTIONS from '../lib/header/options'

export type AppScreens = {
	Home: undefined
	Game: { code: string }
	PastGames: undefined
	PastGame: { code: string }
}

const Stack = createStackNavigator<AppScreens>()

const AppNavigator = () => (
	<Stack.Navigator initialRouteName="Home" screenOptions={HEADER_OPTIONS}>
		<Stack.Screen
			name="Home"
			component={HomeScreen}
			options={{
				title: 'Match Who',
				headerTitle: 'Home',
				headerShown: false
			}}
		/>
		<Stack.Screen
			name="Game"
			component={GameNavigator}
			options={{
				title: 'Match Who',
				headerTitle: 'Game',
				headerShown: false
			}}
		/>
		<Stack.Screen
			name="PastGames"
			component={PastGames}
			options={{
				title: 'Past Games | Match Who',
				headerTitle: 'Past Games'
			}}
		/>
	</Stack.Navigator>
)

export default AppNavigator
