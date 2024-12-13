import {IPosition} from '../../interfaces/Position.ts'
import {calculateBoundary, calculateClawWidth, distanceToLineSegment, rotatePoint} from '../calculationUtils.ts'
import {expect} from 'vitest'

describe('test calculation utils', () => {
	it('should calculate the correct position if rotated clockwise', () => {
		const point: IPosition = {x: 5, y: 5}
		const pivotPoint: IPosition = {x: 1, y: 1}
		const angle = 80

		const result = rotatePoint(point, pivotPoint, angle)

		expect(result).toEqual({x: -2.2446383013811104, y: 5.633823722716554})
	})

	it('should calculate the correct position if rotated counter clockwise', () => {
		const point: IPosition = {x: 5, y: 5}
		const pivotPoint: IPosition = {x: 1, y: 1}
		const angle = -80

		const result = rotatePoint(point, pivotPoint, angle)

		expect(result).toEqual({x: 5.633823722716554, y: -2.2446383013811104})
	})

	it('should return 0 when the point lies on the line segment', () => {
		const px = 2,
			py = 2
		const x1 = 1,
			y1 = 1
		const x2 = 3,
			y2 = 3

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(0, 5)
	})

	it('should return the correct distance for a point closest to the start of the segment', () => {
		const px = 0,
			py = 0
		const x1 = 1,
			y1 = 1
		const x2 = 3,
			y2 = 3

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(Math.sqrt(2), 5)
	})

	it('should return the correct distance for a point closest to the end of the segment', () => {
		const px = 4,
			py = 4
		const x1 = 1,
			y1 = 1
		const x2 = 3,
			y2 = 3

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(Math.sqrt(2), 5)
	})

	it('should handle vertical line segments correctly', () => {
		const px = 3,
			py = 2
		const x1 = 1,
			y1 = 1
		const x2 = 1,
			y2 = 4

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(2, 5)
	})

	it('should handle horizontal line segments correctly', () => {
		const px = 2,
			py = 3
		const x1 = 1,
			y1 = 1
		const x2 = 4,
			y2 = 1

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(2, 5)
	})

	it('should handle degenerate line segments (point-like segments)', () => {
		const px = 3,
			py = 4
		const x1 = 1,
			y1 = 1
		const x2 = 1,
			y2 = 1

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(Math.sqrt((3 - 1) ** 2 + (4 - 1) ** 2), 5)
	})

	it('should calculate the correct claw width', () => {
		const px = 3,
			py = 4
		const x1 = 1,
			y1 = 1
		const x2 = 1,
			y2 = 1

		const result = distanceToLineSegment(px, py, x1, y1, x2, y2)

		expect(result).toBeCloseTo(Math.sqrt((3 - 1) ** 2 + (4 - 1) ** 2), 5)
	})

	it('should return the diagonal width for a claw width of 1', () => {
		const clawWidth = 10
		const result = calculateClawWidth(clawWidth)
		expect(result).toBe(2)
	})

	it('should return the value if it is within the boundary', () => {
		expect(calculateBoundary(50, 100)).toBe(50)
		expect(calculateBoundary(75, 100)).toBe(75)
	})

	it('should return maxValue if the value exceeds maxValue', () => {
		expect(calculateBoundary(150, 100)).toBe(100)
		expect(calculateBoundary(101, 100)).toBe(100)
	})

	it('should return 0 if the value is less than 0', () => {
		expect(calculateBoundary(-10, 100)).toBe(0)
		expect(calculateBoundary(-1, 100)).toBe(0)
	})

	it('should return 0 if the value is exactly 0', () => {
		expect(calculateBoundary(0, 100)).toBe(0)
	})

	it('should return maxValue if the value is exactly maxValue', () => {
		expect(calculateBoundary(100, 100)).toBe(100)
	})
})
