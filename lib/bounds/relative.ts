import Bounds from '.'

const boundsRelativeTo = (bounds: Bounds, relativeTo: Bounds): Bounds => ({
	...bounds,
	x: bounds.x - relativeTo.x,
	y: bounds.y - relativeTo.y
})

export default boundsRelativeTo
