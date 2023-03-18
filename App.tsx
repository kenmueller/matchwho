import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { PortalProvider } from '@gorhom/portal'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppNavigator from './navigators/App'
import unlockOrientationIfTablet from './lib/unlockOrientationIfTablet'
import alertError from './lib/error/alert'

const App = () => {
	useEffect(() => {
		unlockOrientationIfTablet().catch(alertError)
	}, [])

	return (
		<PortalProvider>
			<SafeAreaProvider>
				<NavigationContainer /* linking={linking} */>
					<StatusBar style="light" />
					<AppNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</PortalProvider>
	)
}

export default App
