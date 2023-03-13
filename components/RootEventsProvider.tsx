import { ReactNode, useRef, useMemo, useCallback } from 'react'
import {
	View,
	StyleSheet,
	PointerEvent,
	GestureResponderEvent
} from 'react-native'

import RootEvents, { RootEventsHandlers } from '../lib/rootEvents'
import RootEventsContext from '../lib/rootEvents/context'

const RootEventsProvider = ({ children }: { children?: ReactNode }) => {
	const handlers = useRef<RootEventsHandlers>({
		pointerDown: [],
		pointerMove: [],
		pointerUp: []
	})

	const onEvent = useCallback(
		(name: keyof RootEventsHandlers) =>
			(event: PointerEvent | GestureResponderEvent) => {
				for (const handler of handlers.current[name]) handler(event)
			},
		[handlers]
	)

	const onHandler = useCallback(
		(name: keyof RootEventsHandlers): RootEvents[keyof RootEvents] =>
			handler => {
				const thisHandlers = handlers.current[name]

				thisHandlers.push(handler)

				return () => {
					const index = thisHandlers.indexOf(handler)
					if (index >= 0) thisHandlers.splice(index, 1)
				}
			},
		[handlers]
	)

	const events = useMemo<RootEvents>(
		() => ({
			onPointerDown: onHandler('pointerDown'),
			onPointerMove: onHandler('pointerMove'),
			onPointerUp: onHandler('pointerUp')
		}),
		[onHandler]
	)

	return (
		<View
			onPointerDown={onEvent('pointerDown')}
			onTouchStart={onEvent('pointerDown')}
			onPointerMove={onEvent('pointerMove')}
			onTouchMove={onEvent('pointerMove')}
			onPointerUp={onEvent('pointerUp')}
			onTouchEnd={onEvent('pointerUp')}
			style={styles.root}
		>
			<RootEventsContext.Provider value={events}>
				{children}
			</RootEventsContext.Provider>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: '100%'
	}
})

export default RootEventsProvider
