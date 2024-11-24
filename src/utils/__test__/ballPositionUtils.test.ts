import {
	getBallInitialXMomentum,
	getBallInitialXPos,
	getBallInitialYMomentum,
	getBallInitialYPos,
	getBallRadius,
} from '../ballPositionUtils.ts'

describe('test ball position', () => {
	it('should return individual Ball radius if defined', () => {
		const individualBallRadius = 5
		const generalBallRadius = 10

		expect(getBallRadius(individualBallRadius, generalBallRadius)).toBe(individualBallRadius)
	})

	it('should return general Ball radius if individual Ball radius is not defined', () => {
		const individualBallRadius = undefined
		const generalBallRadius = 10

		expect(getBallRadius(individualBallRadius, generalBallRadius)).toBe(generalBallRadius)
	})

	it('should return general Ball radius if individual Ball radius less than or equal to 0', () => {
		const individualBallRadius = -2
		const generalBallRadius = 10

		expect(getBallRadius(individualBallRadius, generalBallRadius)).toBe(generalBallRadius)
	})

	it('should return y position if defined', () => {
		const yPosValue = 5
		const height = 200

		expect(getBallInitialYPos(yPosValue, height)).toBe(yPosValue)
	})

	it('should calculate a random value if yPosValue is undefined', () => {
		const height = 200
		const result = getBallInitialYPos(undefined, height)

		expect(result).toBeGreaterThanOrEqual(height / 2 + 50)
		expect(result).toBeLessThanOrEqual(height + 50)
	})

	it('should calculate a random value if yPosValue is less than or equal to 0', () => {
		const yPosValue = 0
		const height = 200

		const result = getBallInitialYPos(yPosValue, height)

		expect(result).toBeGreaterThanOrEqual(height / 2 + 50)
		expect(result).toBeLessThanOrEqual(height + 50)
	})

	it('should calculate a random value if yPosValue is greater than or equal to height', () => {
		const yPosValue = 300
		const height = 200

		const result = getBallInitialYPos(yPosValue, height)

		expect(result).toBeGreaterThanOrEqual(height / 2 + 50)
		expect(result).toBeLessThanOrEqual(height + 50)
	})

	it('should return  a random value if height is less than or equal to 0', () => {
		const yPosValue = 300
		const height = 0

		const result = getBallInitialYPos(yPosValue, height)

		expect(result).toBeGreaterThanOrEqual(height / 2 + 50)
		expect(result).toBeLessThanOrEqual(height + 50)
	})

	it('should return x position if defined', () => {
		const xPosition = 5
		const width = 200
		const dividerLineWidth = 50
		expect(getBallInitialXPos(xPosition, width, dividerLineWidth)).toBe(xPosition)
	})

	it('should calculate a random value if xPosValue is undefined', () => {
		const width = 200
		const dividerLineWidth = 50
		const result = getBallInitialXPos(undefined, width, dividerLineWidth)

		expect(result).toBeGreaterThanOrEqual(0 - dividerLineWidth - 50)
		expect(result).toBeLessThanOrEqual(width - dividerLineWidth - 50)
	})

	it('should calculate a random value if xPosValue is less than or equal to 0', () => {
		const xPosValue = 0
		const width = 200
		const dividerLineWidth = 50
		const result = getBallInitialXPos(xPosValue, width, dividerLineWidth)

		expect(result).toBeGreaterThanOrEqual(0 - dividerLineWidth - 50)
		expect(result).toBeLessThanOrEqual(width - dividerLineWidth - 50)
	})

	it('should calculate a random value if width is less than or equal to 0', () => {
		const xPosValue = 50
		const width = 0
		const dividerLineWidth = 50
		const result = getBallInitialXPos(xPosValue, width, dividerLineWidth)

		expect(result).toBeGreaterThanOrEqual(0 - dividerLineWidth - 50)
		expect(result).toBeLessThanOrEqual(width - dividerLineWidth - 50)
	})

	it('should calculate a random value if xPosValue is greater than or equal to width', () => {
		const xPosValue = 250
		const width = 200
		const dividerLineWidth = 50
		const result = getBallInitialXPos(xPosValue, width, dividerLineWidth)

		expect(result).toBeGreaterThanOrEqual(0 - dividerLineWidth - 50)
		expect(result).toBeLessThanOrEqual(width - dividerLineWidth - 50)
	})

	it('should return dx momentum if defined', () => {
		const xMomentum = 5
		expect(getBallInitialXMomentum(xMomentum)).toBe(xMomentum)
	})

	it('should return a random value if dx momentum is not defined', () => {
		const result = getBallInitialXMomentum(undefined)

		expect(result).toBeGreaterThanOrEqual(-2)
		expect(result).toBeLessThanOrEqual(2)
	})

	it('should return dy momentum if defined', () => {
		const yMomentum = 5
		expect(getBallInitialYMomentum(yMomentum)).toBe(yMomentum)
	})

	it('should return a random value if dy momentum is not defined', () => {
		const result = getBallInitialYMomentum(undefined)

		expect(result).toBeGreaterThanOrEqual(-2)
		expect(result).toBeLessThanOrEqual(2)
	})
})
