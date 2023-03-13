import Point from '.'

const addPoints = (a: Point, b: Point): Point => ({
	x: a.x + b.x,
	y: a.y + b.y
})

export default addPoints
