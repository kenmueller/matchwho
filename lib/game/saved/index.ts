import type SavedPlayer from './player'
import type SavedQuestion from './question'

export default interface SavedGame {
	code: string

	/** Milliseconds since epoch of when the game ended. */
	ended: number

	/** Leader name. */
	leader: string

	/**
	 * Includes only the top players.
	 * Sorted from top to bottom by points.
	 */
	players: SavedPlayer[]

	questions: SavedQuestion[]
}
