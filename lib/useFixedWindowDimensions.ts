import { useEffect, useState } from 'react'
import { Dimensions, useWindowDimensions } from 'react-native'
import equal from 'deep-equal'

import _Dimensions from './dimensions'

const useFixedWindowDimensions = () => {
	const [dimensions, setDimensions] = useState<_Dimensions>(
		Dimensions.get('window')
	)

	const _dimensions = useWindowDimensions()

	// Grab dimensions from useWindowDimensions
	useEffect(() => {
		setDimensions(_dimensions)
	}, [_dimensions, setDimensions])

	// Poll dimensions
	useEffect(() => {
		const interval = setInterval(() => {
			const newDimensions = Dimensions.get('window')

			setDimensions(dimensions =>
				equal(dimensions, newDimensions, { strict: true })
					? dimensions
					: newDimensions
			)
		}, 500)

		return () => {
			clearInterval(interval)
		}
	}, [setDimensions])

	return dimensions
}

export default useFixedWindowDimensions
