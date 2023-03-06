import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'

export type AppScreens = {
	Home: undefined
}

const Stack = createStackNavigator<AppScreens>()

const AppNavigator = () => (
	<Stack.Navigator initialRouteName="Home">
		<Stack.Screen
			name="Home"
			component={HomeScreen}
			options={{ headerShown: false }}
		/>
	</Stack.Navigator>
)

export default AppNavigator
