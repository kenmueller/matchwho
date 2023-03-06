import API_ORIGIN from './origin'
import errorFromResponse from '../error/response'

const gameExists = async (code: string) => {
	const response = await fetch(new URL(`/games/${code}/exists`, API_ORIGIN))
	if (!response.ok) throw await errorFromResponse(response)

	return await response.json()
}

export default gameExists
