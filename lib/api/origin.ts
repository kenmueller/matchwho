import Constants from 'expo-constants'

const API_ORIGIN = Constants.expoConfig!.extra!.API_ORIGIN as string
export const SOCKET_ORIGIN = API_ORIGIN.replace('http', 'ws')

export default API_ORIGIN
