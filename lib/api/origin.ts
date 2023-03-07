import api from '../../api.json'

const API_ORIGIN = __DEV__
	? `http://${api.origin}:${api.port}`
	: 'https://matchwho.onrender.com'

export default API_ORIGIN
