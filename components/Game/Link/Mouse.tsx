import { useContext, useState, useEffect } from 'react'

import Point from '../../../lib/point'
import RootEventsContext from '../../../lib/rootEvents/context'
import RawLink from './Raw'

const MouseLink = ({ from }: { from: Point }) => {
	const { onPointerMove } = useContext(RootEventsContext)

	const [to, setTo] = useState<Point | null>(null)

	useEffect(() => {
		return onPointerMove(event => {
			setTo({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
		})
	}, [setTo])

	return to && <RawLink from={from} to={to} />
}

export default MouseLink
