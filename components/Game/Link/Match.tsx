import { useState, useEffect } from 'react'
import {
	View,
	GestureResponderEvent,
	PointerEvent,
	useWindowDimensions
} from 'react-native'

import Point from '../../../lib/point'
import Link from './Base'

/** How far away the link is from the node. */
const SPACING = 8

const MatchLink = ({
	from,
	to,
	onPress
}: {
	from: View
	to: View
	onPress?: (event: PointerEvent | GestureResponderEvent) => void
}) => {
	const dimensions = useWindowDimensions()

	const [fromPoint, setFromPoint] = useState<Point | null>(null)
	const [toPoint, setToPoint] = useState<Point | null>(null)

	useEffect(() => {
		from.measure((_x, _y, width, height, pageX, pageY) => {
			setFromPoint({ x: pageX + width + SPACING, y: pageY + height / 2 })
		})

		to.measure((_x, _y, _width, height, pageX, pageY) => {
			setToPoint({ x: pageX - SPACING, y: pageY + height / 2 })
		})
	}, [
		from,
		setFromPoint,
		to,
		setToPoint,
		dimensions // Update with window dimensions
	])

	return (
		fromPoint &&
		toPoint && <Link from={fromPoint} to={toPoint} onPress={onPress} />
	)
}

export default MatchLink
