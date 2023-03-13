import { View } from 'react-native'

import Bounds from '.'

const getBounds = (view: View) =>
	new Promise<Bounds>(resolve => {
		view.measure((_x, _y, width, height, pageX, pageY) => {
			resolve({ x: pageX, y: pageY, width, height })
		})
	})

export default getBounds
