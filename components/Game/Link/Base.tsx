import {
	GestureResponderEvent,
	PointerEvent,
	View,
	StyleSheet
} from 'react-native'

import Point from '../../../lib/point'
import theme from '../../../lib/theme'

const Link = ({
	from,
	to,
	onPress
}: {
	from: Point
	to: Point
	onPress?: (event: PointerEvent | GestureResponderEvent) => void
}) => {
	const angle = Math.atan2(to.y - from.y, to.x - from.x)
	const distance = Math.sqrt(
		Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
	)

	return (
		<View
			pointerEvents={onPress ? 'auto' : 'none'}
			onPointerDown={onPress}
			onTouchStart={onPress}
			style={[
				styles.root,
				{
					left: from.x,
					top: from.y,
					width: distance,
					transform: [
						// Transform origin is the leftmost point
						{ translateX: -distance / 2 },
						{ rotate: `${angle}rad` },
						{ translateX: distance / 2 }
					]
				}
			]}
		/>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		height: 3.2,
		backgroundColor: theme.white,
		borderRadius: 1.6
	}
})

export default Link
