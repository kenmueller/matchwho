import { Alert, Platform } from 'react-native'

const alertError = (error: unknown) => {
	const message =
		error instanceof Error ? error.message : 'An unknown error occurred'

	console.error(error)
	Platform.OS === 'web' ? alert(message) : Alert.alert('Error', message)
}

export default alertError
