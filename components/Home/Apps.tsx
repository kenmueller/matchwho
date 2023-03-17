import {
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	View
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import theme from '../../lib/theme'
import { ANDROID_URL, IOS_URL } from '../../lib/apps'

const ios = () => {
	window.open(IOS_URL)
}

const android = () => {
	window.open(ANDROID_URL)
}

const HomeApps = () => {
	const dimensions = useWindowDimensions()

	const margin = dimensions.width < 350 ? 16 : 32

	return (
		<View style={[styles.root, { top: margin, right: margin }]}>
			<TouchableOpacity onPress={ios}>
				<Ionicons name="logo-apple" style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity onPress={android}>
				<Ionicons name="logo-android" style={styles.icon} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		flexDirection: 'row',
		gap: 20
	},
	icon: {
		fontSize: 30,
		color: theme.white
	}
})

export default HomeApps
