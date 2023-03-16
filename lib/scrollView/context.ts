import { createContext, RefObject } from 'react'
import { ScrollView } from 'react-native'

const ScrollViewContext = createContext<RefObject<ScrollView | null>>(
	undefined as never
)

export default ScrollViewContext
