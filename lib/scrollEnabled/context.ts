import { createContext, Dispatch, SetStateAction } from 'react'

const ScrollEnabledContext = createContext<
	[boolean, Dispatch<SetStateAction<boolean>>]
>(undefined as never)

export default ScrollEnabledContext
