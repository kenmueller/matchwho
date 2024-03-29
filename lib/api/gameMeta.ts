import errorFromResponse from '../error/response'
import GameMeta from '../game/meta'
import API_ORIGIN from './origin'

const gameMeta = async (code: string) => {
	const response = await fetch(`${API_ORIGIN}/games/${code}`)
	if (!response.ok) throw await errorFromResponse(response)

	return (await response.json()) as GameMeta
}

export default gameMeta
