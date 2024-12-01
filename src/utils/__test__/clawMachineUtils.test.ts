import {
	calculateNewBallPositionsAfterCollision,
	calculateNewClawAnglePosition,
	calculateNewClawXPosition,
	calculateNewClawYPosition,
	checkIfOneOrMoreBallsAreAllGrabbed,
	createInitialBalls,
	getCollisionPoints,
} from '../clawMachineUtils.ts'
import {IClaw} from '../../interfaces/Claw.ts'
import {IBall} from '../../interfaces/Ball.ts'
import {expect} from 'vitest'
import {IInitialBall} from '../../interfaces/InitialBall.ts'

describe('test clawMachineUtils', () => {
	it('should return the correct positions for collision calculation', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 100,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 0,
			dy: 0,
			targetAngle: 0,
		}
		const clawSize = 2
		const clawWidth = 3
		const width = 500
		const height = 500
		const dividerLineWidth = 20
		const dividerLineThickness = 5
		const dividerLineHeight = 200

		const collisionPoints = getCollisionPoints(
			claw,
			clawSize,
			clawWidth,
			width,
			height,
			dividerLineWidth,
			dividerLineThickness,
			dividerLineHeight,
		)

		expect(collisionPoints.innerLineStart).toStrictEqual({x: 100, y: 100})
		expect(collisionPoints.rightInnerLineMiddle1).toStrictEqual({x: 102, y: 102})
		expect(collisionPoints.rightInnerLineMiddle2).toStrictEqual({x: 102, y: 104})
		expect(collisionPoints.rightInnerLineEnd).toStrictEqual({x: 100, y: 106})
		expect(collisionPoints.leftInnerLineMiddle1).toStrictEqual({x: 98, y: 102})
		expect(collisionPoints.leftInnerLineMiddle2).toStrictEqual({x: 98, y: 104})
		expect(collisionPoints.leftInnerLineEnd).toStrictEqual({x: 100, y: 106})
		expect(collisionPoints.outerLineStart).toStrictEqual({x: 100, y: 97})
		expect(collisionPoints.rightOuterLineMiddle1).toStrictEqual({x: 105, y: 100})
		expect(collisionPoints.rightOuterLineMiddle2).toStrictEqual({x: 105, y: 106})
		expect(collisionPoints.rightOuterLineEnd).toStrictEqual({x: 100, y: 109})
		expect(collisionPoints.leftOuterLineMiddle1).toStrictEqual({x: 95, y: 100})
		expect(collisionPoints.leftOuterLineMiddle2).toStrictEqual({x: 95, y: 106})
		expect(collisionPoints.leftOuterLineEnd).toStrictEqual({x: 100, y: 109})
		expect(collisionPoints.dividerLineLeftStart).toStrictEqual({x: 475, y: 200})
		expect(collisionPoints.dividerLineLeftEnd).toStrictEqual({x: 475, y: 500})
		expect(collisionPoints.dividerLineRightStart).toStrictEqual({x: 480, y: 200})
		expect(collisionPoints.dividerLineRightEnd).toStrictEqual({x: 480, y: 500})

		const balls: IBall[] = [
			{x: 100, y: 200, dx: -3, dy: 0, radius: 2, isInDropZone: false, text: 'test1'},
			{x: 100, y: 400, dx: 3, dy: 3, radius: 2, isInDropZone: false, text: 'test2'},
		]
		const gravity: number = 2
		const friction: number = 1
		const groundFriction: number = 1

		const newBallsPositions = calculateNewBallPositionsAfterCollision(
			balls,
			gravity,
			width,
			height,
			friction,
			groundFriction,
			() => console.log(''),
			claw,
			collisionPoints,
		)

		expect(newBallsPositions).toStrictEqual([
			{
				dx: -3,
				dy: 2,
				isInDropZone: false,
				radius: 2,
				text: 'test1',
				x: 97,
				y: 202,
			},
			{
				dx: 3,
				dy: 5,
				isInDropZone: false,
				radius: 2,
				text: 'test2',
				x: 103,
				y: 405,
			},
		])
	})

	it('should check correctly of there are grabbed balls inside the claw', () => {
		const balls: IBall[] = [
			{x: 100, y: 200, dx: -3, dy: 0, radius: 2, isInDropZone: false, text: 'test1'},
			{x: 100, y: 400, dx: 3, dy: 3, radius: 2, isInDropZone: false, text: 'test2'},
		]
		const dividerLineHeight: number = 200
		const result = checkIfOneOrMoreBallsAreAllGrabbed(balls, dividerLineHeight)

		expect(result).toBe(true)
	})

	it('should calculate the correct new claw Y position when claw.y <= claw.targetY', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 5,
			targetAngle: 0,
		}
		const clawStartPositionY: number = 200

		calculateNewClawYPosition(claw, clawStartPositionY)

		expect(claw).toStrictEqual({
			x: 100,
			y: 105, // Increased by dy
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 5,
			targetAngle: 0,
		})
	})

	it('should decrease claw.y when claw.y > claw.targetY', () => {
		const claw: IClaw = {
			x: 100,
			y: 350,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		}
		const clawStartPositionY: number = 200

		calculateNewClawYPosition(claw, clawStartPositionY)

		expect(claw).toStrictEqual({
			x: 100,
			y: 340, // Decreased by dy
			targetX: 300,
			targetY: 200, // Reset to clawStartPositionY
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		})
	})

	it('should clamp claw.y to clawStartPositionY when it goes below it', () => {
		const claw: IClaw = {
			x: 100,
			y: 205,
			targetX: 300,
			targetY: 200,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		}
		const clawStartPositionY: number = 200

		calculateNewClawYPosition(claw, clawStartPositionY)

		expect(claw).toStrictEqual({
			x: 100,
			y: 200, // Clamped to clawStartPositionY
			targetX: 300,
			targetY: 200, // Reset to clawStartPositionY
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		})
	})

	it('should not change claw.y if claw.y equals claw.targetY', () => {
		const claw: IClaw = {
			x: 100,
			y: 300,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		}
		const clawStartPositionY: number = 200

		calculateNewClawYPosition(claw, clawStartPositionY)

		expect(claw).toStrictEqual({
			x: 100,
			y: 310, // Increased by dy
			targetX: 300,
			targetY: 300, // Unchanged
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 5,
			dy: 10,
			targetAngle: 0,
		})
	})

	it('should move left when claw.x > claw.targetX and targetX > 0', () => {
		const claw: IClaw = {
			x: 300,
			y: 100,
			targetX: 250,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 10,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(290) // x decreases by dx
	})

	it('should stop at targetX when moving left overshoots the target', () => {
		const claw: IClaw = {
			x: 260,
			y: 100,
			targetX: 250,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 20,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(250) // x is clamped to targetX
	})

	it('should move right when claw.x < claw.targetX and targetX < width', () => {
		const claw: IClaw = {
			x: 200,
			y: 100,
			targetX: 250,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 10,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(210) // x increases by dx
	})

	it('should stop at targetX when moving right overshoots the target', () => {
		const claw: IClaw = {
			x: 240,
			y: 100,
			targetX: 250,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 20,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(250) // x is clamped to targetX
	})

	it('should not move when claw.targetX is 0', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 0,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 10,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(100) // x does not move
	})

	it('should not move when claw.targetX is equal to the width', () => {
		const claw: IClaw = {
			x: 490,
			y: 100,
			targetX: 500,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 10,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(490) // x does not move
	})

	it('should not overshoot targetX when targetX is within bounds', () => {
		const claw: IClaw = {
			x: 480,
			y: 100,
			targetX: 500,
			targetY: 100,
			returnOnContact: true,
			angle: 0,
			dAngle: 0,
			dx: 30,
			dy: 0,
			targetAngle: 0,
		}
		const width = 500

		calculateNewClawXPosition(claw, width)

		expect(claw.x).toBe(480) // x is clamped to targetX
	})

	it('should decrease the angle when claw.angle > claw.targetAngle', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 45,
			targetAngle: 30,
			dAngle: 5,
			dx: 0,
			dy: 0,
		}

		calculateNewClawAnglePosition(claw)

		expect(claw.angle).toBe(40) // Angle decreases by dAngle
	})

	it('should increase the angle when claw.angle < claw.targetAngle', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 15,
			targetAngle: 30,
			dAngle: 5,
			dx: 0,
			dy: 0,
		}

		calculateNewClawAnglePosition(claw)

		expect(claw.angle).toBe(20) // Angle increases by dAngle
	})

	it('should not change the angle when claw.angle === claw.targetAngle', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 30,
			targetAngle: 30,
			dAngle: 5,
			dx: 0,
			dy: 0,
		}

		calculateNewClawAnglePosition(claw)

		expect(claw.angle).toBe(35) // Angle remains unchanged
	})

	it('should handle small dAngle correctly', () => {
		const claw: IClaw = {
			x: 100,
			y: 100,
			targetX: 300,
			targetY: 300,
			returnOnContact: true,
			angle: 44,
			targetAngle: 45,
			dAngle: 0.5,
			dx: 0,
			dy: 0,
		}

		calculateNewClawAnglePosition(claw)

		expect(claw.angle).toBe(44.5) // Angle increases by dAngle
	})

	it('should set initial balls correctly', () => {
		const balls: IInitialBall[] = [
			{
				text: 'test123',
				ballColor: 'green',
				ballTextColor: 'yellow',
				startXMomentum: 1,
				startYMomentum: 1,
				startX: 200,
				startY: 300,
			},
			{
				text: 'test321',
				ballColor: 'red',
				ballTextColor: 'yellow',
				startXMomentum: 1,
				startYMomentum: 1,
				startX: 200,
				startY: 300,
			},
		]

		const result = createInitialBalls(balls, [], 400, 400, 20, 50)

		expect(result).toStrictEqual([
			{
				ballColor: 'green',
				ballTextAlign: undefined,
				ballTextBaseline: undefined,
				ballTextColor: 'yellow',
				ballTextFontSize: undefined,
				dx: 1,
				dy: 1,
				icon: undefined,
				imageHeight: undefined,
				imageWidth: undefined,
				isInDropZone: false,
				radius: 20,
				text: 'test123',
				x: 200,
				y: 300,
			},
			{
				ballColor: 'red',
				ballTextAlign: undefined,
				ballTextBaseline: undefined,
				ballTextColor: 'yellow',
				ballTextFontSize: undefined,
				dx: 1,
				dy: 1,
				icon: undefined,
				imageHeight: undefined,
				imageWidth: undefined,
				isInDropZone: false,
				radius: 20,
				text: 'test321',
				x: 200,
				y: 300,
			},
		])
	})

	it('should set initial balls correctly without the already dropped balls', () => {
		const balls: IInitialBall[] = [
			{
				text: 'test123',
				ballColor: 'green',
				ballTextColor: 'yellow',
				startXMomentum: 1,
				startYMomentum: 1,
				startX: 200,
				startY: 300,
			},
			{
				text: 'test321',
				ballColor: 'red',
				ballTextColor: 'yellow',
				startXMomentum: 1,
				startYMomentum: 1,
				startX: 200,
				startY: 300,
			},
		]

		const alreadyDroppedBalls: IBall[] = [
			{
				ballColor: 'green',
				ballTextAlign: undefined,
				ballTextBaseline: undefined,
				ballTextColor: 'yellow',
				ballTextFontSize: undefined,
				dx: 1,
				dy: 1,
				icon: undefined,
				imageHeight: undefined,
				imageWidth: undefined,
				isInDropZone: false,
				radius: 20,
				text: 'test123',
				x: 200,
				y: 300,
			},
		]

		const result = createInitialBalls(balls, alreadyDroppedBalls, 400, 400, 20, 50)

		expect(result).toStrictEqual([
			{
				ballColor: 'red',
				ballTextAlign: undefined,
				ballTextBaseline: undefined,
				ballTextColor: 'yellow',
				ballTextFontSize: undefined,
				dx: 1,
				dy: 1,
				icon: undefined,
				imageHeight: undefined,
				imageWidth: undefined,
				isInDropZone: false,
				radius: 20,
				text: 'test321',
				x: 200,
				y: 300,
			},
		]) // Angle increases by dAngle
	})
})
