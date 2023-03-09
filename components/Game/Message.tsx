import { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import theme from '../../lib/theme'

const GameMessage = ({
	error = false,
	title,
	description,
	children
}: {
	error?: boolean
	title: string
	description?: string
	children?: ReactNode
}) => (
	<View>
		<Text style={[styles.title, error && styles.error]}>{title}</Text>
		{description && (
			<Text style={[styles.description, error && styles.error]}>
				{description}
			</Text>
		)}
		{children}
	</View>
)

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: theme.white
	},
	description: {
		marginTop: 12,
		fontSize: 18,
		fontWeight: '700'
	},
	error: {
		color: theme.red
	}
})

export default GameMessage
