import { createContext, Dispatch, SetStateAction } from 'react'

import { GameStream } from '../../api/gameStream'

const GameStreamContext = createContext<
	[GameStream | null, Dispatch<SetStateAction<GameStream | null>>]
>(undefined as never)

export default GameStreamContext
