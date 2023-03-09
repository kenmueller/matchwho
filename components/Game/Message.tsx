import { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import theme from '../../lib/theme'

const GameMessage = ({
	error = false,
	title,
	children
}: {
	error?: boolean
	title: string
	children?: ReactNode
}) => (
	<View>
		<Text style={[styles.title, error && styles.error]}>{title}</Text>
		{children}
	</View>
)

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: theme.white
	},
	error: {
		color: theme.red
	}
})

export default GameMessage
