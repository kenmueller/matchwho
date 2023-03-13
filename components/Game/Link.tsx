import { GestureResponderEvent, View, StyleSheet } from 'react-native'

import Point from '../../lib/point'
import theme from '../../lib/theme'

const shouldSetResponder = () => true

const Link = ({
	from,
	to,
	onPress
}: {
	from: Point
	to: Point
	onPress?: (event: GestureResponderEvent) => void
}) => {
	const angle = Math.atan2(to.y - from.y, to.x - from.x)
	const distance = Math.sqrt(
		Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
	)

	return (
		<>
			<View
				pointerEvents="none"
				style={{
					position: 'absolute',
					left: from.x,
					top: from.y,
					width: distance,
					height: 3.2,
					transform: [
						// Transform origin is the leftmost point
						{ translateX: -distance / 2 },
						{ rotate: `${angle}rad` },
						{ translateX: distance / 2 }
					],
					backgroundColor: theme.white,
					borderRadius: 1.6
				}}
			/>
			{onPress && (
				<View
					onStartShouldSetResponder={shouldSetResponder}
					onResponderStart={onPress}
					style={{
						position: 'absolute',
						left: from.x,
						top: from.y,
						width: distance,
						height: 9.6,
						transform: [
							// Transform origin is the leftmost point
							{ translateX: -distance / 2 },
							{ rotate: `${angle}rad` },
							{ translateX: distance / 2 }
						]
					}}
				/>
			)}
		</>
	)
}

export default Link
