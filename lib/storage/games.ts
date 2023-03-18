import AsyncStorage from '@react-native-async-storage/async-storage'
import Game from '../game'
import SavedGame from '../game/saved'

const STORAGE_KEY = '@games'

const getMap = async () => {
	const string = await AsyncStorage.getItem(STORAGE_KEY)
	const map: Record<string, SavedGame> = string ? JSON.parse(string) : {}

	return map
}

export const fetchGames = async () => {
	const map = await getMap()

	// Latest dates first
	return Object.values(map).sort((a, b) => b.ended - a.ended)
}

export const saveGame = async (game: Game) => {
	const map = await getMap()

	map[game.code] = {
		code: game.code,
		ended: Date.now(),
		leader: game.leaderName,
		players:
			// `Player` includes more properties than just id, name, points
			game.results?.players?.map(({ id, name, points }) => ({
				id,
				name,
				points
			})) ?? [],
		questions: game.results?.questions ?? []
	}

	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}
