import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@name'

export const fetchName = async () => {
	const value = await AsyncStorage.getItem(STORAGE_KEY)
	return value ?? ''
}

export const saveName = async (name: string) => {
	await AsyncStorage.setItem(STORAGE_KEY, name)
}
