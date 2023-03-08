const devOrigin = () => {
	const { origin, port } = require('../../api.json')
	return `http://${origin}:${port}`
}

const API_ORIGIN = __DEV__ ? devOrigin() : 'https://matchwho.onrender.com'
export const SOCKET_ORIGIN = API_ORIGIN.replace('http', 'ws')

export default API_ORIGIN
