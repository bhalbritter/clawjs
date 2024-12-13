import {IPosition} from '../interfaces/Position.ts'

/**
 * rotates the points for opening the claw
 * @param point the normal position of the point
 * @param pivot the anchor point for the rotation
 * @param angle the rotation angle
 */
export const rotatePoint = (point: IPosition, pivot: IPosition, angle: number): IPosition => {
	const rad: number = angle * (Math.PI / 180) // Convert angle to radians
	const cos: number = Math.cos(rad)
	const sin: number = Math.sin(rad)

	const x: number = point.x - pivot.x
	const y: number = point.y - pivot.y

	const newX: number = x * cos - y * sin + pivot.x
	const newY: number = x * sin + y * cos + pivot.y

	return {x: newX, y: newY}
}

/**
 * Calculates the shortest distance from a point to a line segment.
 *
 * @param px - The x-coordinate of the point.
 * @param py - The y-coordinate of the point.
 * @param x1 - The x-coordinate of the start of the line segment.
 * @param y1 - The y-coordinate of the start of the line segment.
 * @param x2 - The x-coordinate of the end of the line segment.
 * @param y2 - The y-coordinate of the end of the line segment.
 * @returns The shortest distance from the point (px, py) to the line segment from (x1, y1) to (x2, y2).
 */
export const distanceToLineSegment = (
	px: number,
	py: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): number => {
	const A: number = px - x1
	const B: number = py - y1
	const C: number = x2 - x1
	const D: number = y2 - y1

	const dot: number = A * C + B * D
	const len_sq: number = C * C + D * D
	const param: number = len_sq !== 0 ? dot / len_sq : -1

	let xx: number, yy: number

	if (param < 0) {
		xx = x1
		yy = y1
	} else if (param > 1) {
		xx = x2
		yy = y2
	} else {
		xx = x1 + param * C
		yy = y1 + param * D
	}

	const dx: number = px - xx
	const dy: number = py - yy
	return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates the diagonal width based on the given claw width.
 *
 * @param clawWidth - The width of the claw.
 * @returns The diagonal width calculated using the Pythagorean theorem.
 */
export const calculateClawWidth = (clawWidth: number): number => {
	return Math.sqrt(clawWidth ^ (2 + clawWidth) ^ 2)
}

/**
 * checks if the new value is inside the set Boundary between 0 and maxValue
 * @param value the new value
 * @param maxValue the maximum value
 */
export function calculateBoundary(value: number, maxValue: number) {
	if (value > maxValue) {
		return maxValue
	} else if (value < 0) {
		return 0
	} else {
		return value
	}
}
