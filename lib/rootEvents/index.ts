import { PointerEvent, GestureResponderEvent } from 'react-native'

export interface RootEventsHandlers {
	pointerDown: ((event: PointerEvent | GestureResponderEvent) => void)[]
	pointerMove: ((event: PointerEvent | GestureResponderEvent) => void)[]
	pointerUp: ((event: PointerEvent | GestureResponderEvent) => void)[]
}

export default interface RootEvents {
	onPointerDown: (
		handler: (event: PointerEvent | GestureResponderEvent) => void
	) => () => void
	onPointerMove: (
		handler: (event: PointerEvent | GestureResponderEvent) => void
	) => () => void
	onPointerUp: (
		handler: (event: PointerEvent | GestureResponderEvent) => void
	) => () => void
}
