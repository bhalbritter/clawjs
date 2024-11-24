import {IBall} from '../../interfaces/Ball.ts'
import {IPosition} from '../../interfaces/Position.ts'
import {
	calculateCollisionsBetweenBalls,
	calculateCollisionWithCanvasEdges,
	calculateCollisionWithDividerLines,
	calculateCollisionWithLeftInnerClaw,
	calculateCollisionWithLeftOuterClaw,
	calculateCollisionWithRightInnerClaw,
	calculateCollisionWithRightOuterClaw,
} from '../collisionChecks.ts'
import {expect} from 'vitest'

describe('test collision check utils', () => {
	const lineStart: IPosition = {x: 2, y: 3}
	const lineMiddle1: IPosition = {x: 2, y: 2}
	const lineMiddle2: IPosition = {x: 2, y: 1}
	const lineEnd: IPosition = {x: 2, y: 0}

	it('should calculate correct collision for left inner claw and check if collision with line is not called', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}
		const mockIsCollidingWithLine = vi.fn()

		vi.mock('./pathToIsCollidingWithLine', () => ({
			isCollidingWithLine: mockIsCollidingWithLine,
		}))

		calculateCollisionWithLeftInnerClaw(
			ball,
			lineStart,
			lineMiddle1,
			lineMiddle2,
			lineEnd,
			false,
			mockIsCollidingWithLine,
		)

		expect(mockIsCollidingWithLine).not.toHaveBeenCalled()
		expect(ball).toEqual({
			x: 0.2360679774997898,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for left inner claw and check if collision with line is called once', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}
		const mockIsCollidingWithLine = vi.fn()

		vi.mock('./pathToIsCollidingWithLine', () => ({
			isCollidingWithLine: mockIsCollidingWithLine,
		}))

		calculateCollisionWithLeftInnerClaw(
			ball,
			lineStart,
			lineMiddle1,
			lineMiddle2,
			lineEnd,
			true,
			mockIsCollidingWithLine,
		)

		expect(mockIsCollidingWithLine).toHaveBeenCalledOnce()
		expect(ball).toEqual({
			x: 0.2360679774997898,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for right inner claw and check if collision with line is not called', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}
		const mockIsCollidingWithLine = vi.fn()

		vi.mock('./pathToIsCollidingWithLine', () => ({
			isCollidingWithLine: mockIsCollidingWithLine,
		}))

		calculateCollisionWithRightInnerClaw(
			ball,
			lineStart,
			lineMiddle1,
			lineMiddle2,
			lineEnd,
			false,
			mockIsCollidingWithLine,
		)

		expect(mockIsCollidingWithLine).not.toHaveBeenCalled()
		expect(ball).toEqual({
			x: 3,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for right inner claw and check if collision with line is called once', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}
		const mockIsCollidingWithLine = vi.fn()

		vi.mock('./pathToIsCollidingWithLine', () => ({
			isCollidingWithLine: mockIsCollidingWithLine,
		}))

		calculateCollisionWithRightInnerClaw(
			ball,
			lineStart,
			lineMiddle1,
			lineMiddle2,
			lineEnd,
			true,
			mockIsCollidingWithLine,
		)

		expect(mockIsCollidingWithLine).toHaveBeenCalledOnce()
		expect(ball).toEqual({
			x: 3,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for right outer claw', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}

		calculateCollisionWithRightOuterClaw(ball, lineStart, lineMiddle1, lineMiddle2, lineEnd)

		expect(ball).toEqual({
			x: 0.2360679774997898,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for left outer claw', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}

		calculateCollisionWithLeftOuterClaw(ball, lineStart, lineMiddle1, lineMiddle2, lineEnd)

		expect(ball).toEqual({
			x: 3,
			y: 3,
			dx: 0.75,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for divider lines', () => {
		const ball: IBall = {x: 1, y: 3, dx: 3, dy: 0, radius: 2, isInDropZone: false, text: 'test'}
		const dividerLine1Start: IPosition = {x: 2, y: 3}
		const dividerLine1End: IPosition = {x: 2, y: 2}
		const dividerLine2Start: IPosition = {x: 2, y: 1}
		const dividerLine2End: IPosition = {x: 2, y: 0}

		calculateCollisionWithDividerLines(ball, dividerLine1Start, dividerLine1End, dividerLine2Start, dividerLine2End)

		expect(ball).toEqual({
			x: 2,
			y: 3,
			dx: 1.5,
			dy: 0,
			radius: 2,
			isInDropZone: false,
			text: 'test',
		})
	})

	it('should calculate correct collision for the canvas Edges', () => {
		const ball: IBall = {x: 1, y: 1, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'}
		const width = 200
		const height = 200
		const friction = 2
		const groundFriction = 2

		calculateCollisionWithCanvasEdges(ball, width, height, friction, groundFriction)

		expect(ball).toEqual({
			dx: 6,
			dy: -2,
			isInDropZone: false,
			radius: 2,
			text: 'test',
			x: 2,
			y: 2,
		})
	})

	it('should put ball back to the canvas edges if it is outside on bottom', () => {
		const ball: IBall = {x: -20, y: -300, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'}
		const width = 200
		const height = 200
		const friction = 2
		const groundFriction = 2

		calculateCollisionWithCanvasEdges(ball, width, height, friction, groundFriction)

		expect(ball).toEqual({
			dx: 6,
			dy: -2,
			isInDropZone: false,
			radius: 2,
			text: 'test',
			x: 2,
			y: 2,
		})
	})

	it('should put ball back to the canvas edges if it is outside on top', () => {
		const ball: IBall = {x: -20, y: 300, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'}
		const width = 200
		const height = 200
		const friction = 2
		const groundFriction = 2

		calculateCollisionWithCanvasEdges(ball, width, height, friction, groundFriction)

		expect(ball).toEqual({
			dx: 12,
			dy: -2,
			isInDropZone: false,
			radius: 2,
			text: 'test',
			x: 2,
			y: 198,
		})
	})

	it('should calculate position between Balls that are at the same position', () => {
		const balls: IBall[] = [
			{x: 20, y: 20, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'},
			{x: 20, y: 20, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'},
		]

		calculateCollisionsBetweenBalls(balls)

		expect(balls).toEqual([
			{
				dx: -1.5,
				dy: 0.5,
				isInDropZone: false,
				radius: 2,
				text: 'test',
				x: 18,
				y: 20,
			},
			{
				dx: -1.5,
				dy: 0.5,
				isInDropZone: false,
				radius: 2,
				text: 'test',
				x: 22,
				y: 20,
			},
		])
	})

	it('should calculate position between Balls that are apart', () => {
		const balls: IBall[] = [
			{x: 50, y: 50, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'},
			{x: 20, y: 20, dx: -3, dy: 1, radius: 2, isInDropZone: false, text: 'test'},
		]

		calculateCollisionsBetweenBalls(balls)

		expect(balls).toEqual([
			{
				dx: -3,
				dy: 1,
				isInDropZone: false,
				radius: 2,
				text: 'test',
				x: 50,
				y: 50,
			},
			{
				dx: -3,
				dy: 1,
				isInDropZone: false,
				radius: 2,
				text: 'test',
				x: 20,
				y: 20,
			},
		])
	})
})
