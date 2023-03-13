import { StatusBar } from 'expo-status-bar'
import {
	/* LinkingOptions, */ NavigationContainer
} from '@react-navigation/native'
import { PortalProvider } from '@gorhom/portal'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootEventsProvider from './components/RootEventsProvider'
import AppNavigator /*, { AppScreens } */ from './navigators/App'

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
	<RootEventsProvider>
		<PortalProvider>
			<SafeAreaProvider>
				<NavigationContainer /* linking={linking} */>
					<StatusBar style="light" />
					<AppNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</PortalProvider>
	</RootEventsProvider>
)

export default App
