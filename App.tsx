import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'

import AppNavigator from './navigators/App'

const App = () => (
	<NavigationContainer>
		<StatusBar style="light" />
		<AppNavigator />
	</NavigationContainer>
)

export default App
