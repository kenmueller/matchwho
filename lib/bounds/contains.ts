import Bounds from '.'
import Point from '../point'

const boundsContains = (bounds: Bounds, point: Point) =>
	point.x >= bounds.x &&
	point.x <= bounds.x + bounds.width &&
	point.y >= bounds.y &&
	point.y <= bounds.y + bounds.height

export default boundsContains
