import API_ORIGIN from './origin'
import errorFromResponse from '../error/response'

const gameExists = async (code: string) => {
	const response = await fetch(`${API_ORIGIN}/games/${code}/exists`)
	if (!response.ok) throw await errorFromResponse(response)

	return (await response.json()) as boolean
}

export default gameExists
