import { Alert, Platform } from 'react-native'

const confirm = (title: string, message: string) =>
	Platform.OS === 'web'
		? Promise.resolve(window.confirm(message))
		: new Promise<boolean>(resolve => {
				Alert.alert(title, message, [
					{
						text: 'Cancel',
						style: 'cancel',
						onPress: () => resolve(false)
					},
					{
						text: 'OK',
						onPress: () => resolve(true)
					}
				])
		  })

export default confirm
