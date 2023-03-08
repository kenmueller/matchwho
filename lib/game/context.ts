import { createContext, Dispatch, SetStateAction } from 'react'

import Game from '.'

const GameContext = createContext<
	[Game | null, Dispatch<SetStateAction<Game | null>>]
>(undefined as never)

export default GameContext
