import { StatusBar } from 'expo-status-bar'
import {
	/* LinkingOptions, */ NavigationContainer
} from '@react-navigation/native'

import AppNavigator /*, { AppScreens } */ from './navigators/App'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
	<SafeAreaProvider>
		<NavigationContainer /* linking={linking} */>
			<StatusBar style="light" />
			<AppNavigator />
		</NavigationContainer>
	</SafeAreaProvider>
)

export default App
