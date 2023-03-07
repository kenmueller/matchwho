import alertError from '../error/alert'
import ClientGameData from '../game/data/client'
import ServerGameData from '../game/data/server'
import { SOCKET_ORIGIN } from './origin'

export interface GameStream {
	onData(handler: (data: ServerGameData) => Promise<void> | void): () => void
	send(data: ClientGameData): void
	close(): void
}

const gameStream = (code: string, name: string): GameStream => {
	const socket = new WebSocket(
		new URL(
			`/games/${code}?name=${encodeURIComponent(name)}`,
			SOCKET_ORIGIN
		)
	)

	return {
		onData: handler => {
			const _handler = async ({ data }: MessageEvent<string>) => {
				try {
					await handler(JSON.parse(data))
				} catch (error) {
					alertError(error)
				}
			}

			socket.addEventListener('message', _handler)

			return () => {
				socket.removeEventListener('message', _handler)
			}
		},
		send: data => {
			socket.send(JSON.stringify(data))
		},
		close: () => {
			socket.close()
		}
	}
}

export default gameStream
