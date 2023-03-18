import { StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
	header: {
		backgroundColor: theme.darkGray
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700'
	}
})

const HEADER_OPTIONS = {
	headerTitleAlign: 'center',
	headerTintColor: theme.white,
	headerStyle: styles.header,
	headerTitleStyle: styles.headerTitle
} as const

export default HEADER_OPTIONS
