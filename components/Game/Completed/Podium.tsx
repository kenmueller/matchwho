import { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import Bounds from '../../../lib/bounds'
import getBounds from '../../../lib/bounds/get'
import alertError from '../../../lib/error/alert'
import SavedPlayer from '../../../lib/game/saved/player'
import Pedestal from './Pedestal'

const INDICES = [1, 0, 2]
const COLLAPSED_INDICES = [0, 1, 2]

const GameResultsPodium = ({ players }: { players: SavedPlayer[] }) => {
	const dimensions = useWindowDimensions()

	const root = useRef<View | null>(null)
	const [bounds, setBounds] = useState<Bounds | null>(null)

	const collapsed = bounds ? bounds.width < 330 : false

	const updateBounds = useCallback(() => {
		if (!root.current) return
		getBounds(root.current).then(setBounds).catch(alertError)
	}, [root, setBounds])

	useEffect(() => {
		updateBounds()
	}, [updateBounds, dimensions])

	return (
		<View
			ref={current => (root.current = current)}
			onLayout={updateBounds}
			style={styles.root}
		>
			{bounds && (
				<View
					style={[
						styles.container,
						collapsed && styles.collapsed,
						{
							paddingVertical: collapsed
								? 0
								: bounds.width < 400
								? 0
								: bounds.width < 600
								? 20
								: 40
						}
					]}
				>
					{(collapsed ? COLLAPSED_INDICES : INDICES).map(index => (
						<Pedestal
							key={index}
							player={players[index] ?? null} // May not have enough players
							index={index}
							collapsed={collapsed}
							bounds={bounds}
						/>
					))}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		width: '100%'
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		maxWidth: 1000,
		width: '100%'
	},
	collapsed: {
		flexDirection: 'column'
	}
})

export default GameResultsPodium
