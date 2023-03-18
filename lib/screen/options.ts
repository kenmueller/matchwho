import { StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
	header: {
		backgroundColor: theme.darkGray
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700'
	},
	card: {
		width: '100%',
		height: '100%'
	}
})

const SCREEN_OPTIONS = {
	headerTitleAlign: 'center',
	headerTintColor: theme.white,
	headerStyle: styles.header,
	headerTitleStyle: styles.headerTitle,
	cardStyle: styles.card
} as const

export default SCREEN_OPTIONS
