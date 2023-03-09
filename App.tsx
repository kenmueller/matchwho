import { StatusBar } from 'expo-status-bar'
import {
	/* LinkingOptions, */ NavigationContainer
} from '@react-navigation/native'

import AppNavigator, { AppScreens } from './navigators/App'

// const linking: LinkingOptions<AppScreens> = {
// 	prefixes: ['https://matchwho.io'],
// 	config: {
// 		screens: {
// 			Home: '/',
// 			Game: '/Game'
// 		}
// 	}
// }

const App = () => (
	<NavigationContainer /* linking={linking} */>
		<StatusBar style="light" />
		<AppNavigator />
	</NavigationContainer>
)

export default App
