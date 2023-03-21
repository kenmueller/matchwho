import { io } from 'socket.io-client'

import ClientGameData from '../game/data/client'
import ServerGameData from '../game/data/server'
import API_ORIGIN from './origin'

export interface GameStream {
	onData(handler: (data: ServerGameData) => void): () => void
	send(data: ClientGameData): void
	close(): void
}

const gameStream = (code: string, name: string | null): GameStream => {
	const socket = io(`${API_ORIGIN}/games/${code}/stream`, {
		query: { name: name ?? '' }
	})

	return {
		onData: handler => {
			socket.on('message', handler)

			return () => {
				socket.off('message', handler)
			}
		},
		send: data => {
			socket.emit('message', data)
		},
		close: () => {
			socket.disconnect()
		}
	}
}

export default gameStream
