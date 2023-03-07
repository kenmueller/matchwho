import API_ORIGIN from './origin'
import errorFromResponse from '../error/response'

const createGame = async () => {
	const response = await fetch(`${API_ORIGIN}/games`, {
		method: 'POST'
	})
	if (!response.ok) throw await errorFromResponse(response)

	return await response.text()
}

export default createGame
