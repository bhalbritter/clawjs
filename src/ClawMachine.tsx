import React, {useRef, useEffect} from 'react'
import {IBall} from './interfaces/Ball.ts'
import {IPosition} from './interfaces/Position.ts'
import {IClaw} from './interfaces/Claw.ts'
import {drawBall, drawClaw, drawDividerLine, preloadImagesForBalls} from './utils/drawUtils.ts'
import {calculateWidth, rotatePoint} from './utils/calculationUtils.ts'
import {
	calculateCollisionsBetweenBalls,
	calculateCollisionWithCanvasEdges,
	calculateCollisionWithDividerLines,
	calculateCollisionWithLeftInnerClaw,
	calculateCollisionWithLeftOuterClaw,
	calculateCollisionWithRightInnerClaw,
	calculateCollisionWithRightOuterClaw,
} from './utils/collisionChecks.ts'
import {IInitialBall} from './interfaces/InitialBall.ts'
import {
	getBallInitialXMomentum,
	getBallInitialXPos,
	getBallInitialYMomentum,
	getBallInitialYPos,
	getBallRadius,
} from './utils/ballPositionUtils.ts'

/**
 * Props for the ClawMachine component.
 */
interface IClawMachineProps {
	/**
	 * Data for each ball to be displayed in the claw machine.
	 * Each item should represent an individual skill or ball item.
	 */
	readonly ballData: IInitialBall[]

	/**
	 * Width of the canvas in pixels. Defaults to `600`.
	 */
	readonly width?: number

	/**
	 * Height of the canvas in pixels. Defaults to `400`.
	 */
	readonly height?: number

	/**
	 * Gravity affecting the balls in the claw machine.
	 * This controls how fast balls fall. Defaults to `0.2`.
	 */
	readonly gravity?: number

	/**
	 * Friction applied to the balls' movement, slowing them down gradually.
	 * Defaults to `0.99`.
	 */
	readonly friction?: number

	/**
	 * Friction when balls contact the ground. Helps simulate realistic movement.
	 * Defaults to `0.8`.
	 */
	readonly groundFriction?: number

	/**
	 * Size of the claw in pixels. Controls how large the claw appears.
	 * Defaults to `30`.
	 */
	readonly clawSize?: number

	/**
	 * Width of the divider line in pixels.
	 * Defaults to `70`.
	 */
	readonly dividerLineWidth?: number

	/**
	 * Height of the divider line opening at the top in pixels.
	 * Defaults to `140`.
	 */
	readonly dividerLineHeight?: number

	/**
	 * Thickness of the divider line in pixels.
	 * Defaults to `20`.
	 */
	readonly dividerLineThickness?: number

	/**
	 * Width of the claw arms in pixels.
	 * Controls the visual width of each claw arm. Defaults to `10`.
	 */
	readonly clawWidth?: number

	/**
	 * Initial horizontal position of the claw when it is raised.
	 * Defaults to `200`.
	 */
	readonly clawStartPositionX?: number

	/**
	 * Initial vertical position of the claw when it is raised.
	 * Defaults to `40`.
	 */
	readonly clawStartPositionY?: number

	/**
	 * Initial open Angle of the Claw.
	 * Defaults to `0`.
	 */
	readonly clawStartOpenAngle?: number

	/**
	 * horizontal speed of the claw during movement.
	 * Defaults to `2`.
	 */
	readonly clawSpeedX?: number

	/**
	 * vertical speed of the claw during movement.
	 * Defaults to `1.1`.
	 */
	readonly clawSpeedY?: number

	/**
	 * opening speed  of the claw.
	 * Defaults to `1`.
	 */
	readonly clawOpenSpeed?: number

	/**
	 * Radius of each ball in pixels. Defaults to `20`.
	 */
	readonly ballRadius: number

	/**
	 * List of balls that have already been dropped.
	 * Allows tracking of dropped balls across component re-renders.
	 */
	readonly alreadyDroppedBalls: IBall[]

	/**
	 * Callback function to add new balls to the dropped balls list.
	 * used to remove some balls from the initial balls list
	 *
	 * @param balls - Array of balls that were dropped
	 */
	readonly addToDroppedBalls: (balls: IBall[]) => void
}

export const ClawMachine: React.FC<IClawMachineProps> = ({
	ballData,
	width = 600,
	height = 400,
	gravity = 0.2,
	friction = 0.99,
	groundFriction = 0.8,
	clawSize = 30,
	dividerLineWidth = 70,
	dividerLineHeight = 140,
	dividerLineThickness = 20,
	clawWidth = 10,
	clawStartPositionX = 200,
	clawStartPositionY = 40,
	clawStartOpenAngle = 0,
	clawSpeedX = 2,
	clawSpeedY = 1.1,
	clawOpenSpeed = 1,
	ballRadius = 20,
	alreadyDroppedBalls,
	addToDroppedBalls,
}): React.ReactElement => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	let balls: IBall[] = []
	let mousePos: IPosition = {x: 0, y: 0}
	const claw: IClaw = {
		x: clawStartPositionX,
		y: clawStartPositionY,
		angle: clawStartOpenAngle,
		targetY: clawStartPositionY,
		targetX: clawStartPositionX,
		targetAngle: clawStartOpenAngle,
		dx: clawSpeedX,
		dy: clawSpeedY,
		dAngle: clawOpenSpeed,
		returnOnContact: false,
	}
	let allowUserControl: boolean = true

	const createBalls = () => {
		const initialBalls: IBall[] = []
		ballData
			.filter(
				(initialBall) =>
					!alreadyDroppedBalls.find((alreadyDropped) => alreadyDropped.text === initialBall.text),
			)
			.forEach((entry) => {
				initialBalls.push({
					x: getBallInitialXPos(entry.startX, width, dividerLineWidth),
					y: getBallInitialYPos(entry.startY, height),
					radius: getBallRadius(entry.radius, ballRadius),
					dx: getBallInitialXMomentum(entry.startXMomentum),
					dy: getBallInitialYMomentum(entry.startYMomentum),
					isInDropZone: false,
					text: entry.text,
					iconPath: entry.iconPath,
					ballColor: entry.ballColor,
					ballTextFontSize: entry.ballTextFontSize,
					ballTextAlign: entry.ballTextAlign,
					ballTextBaseline: entry.ballTextBaseline,
					ballTextColor: entry.ballTextColor,
					imageHeight: entry.imageHeight,
					imageWidth: entry.imageWidth,
				})
			})
		balls = initialBalls
	}

	if (balls.length === 0) {
		createBalls()
		preloadImagesForBalls(balls) // Preload images for all balls
	}

	function handleMoveClawY() {
		if (claw.y <= claw.targetY) {
			claw.y += claw.dy
		} else {
			claw.y -= claw.dy
			claw.targetY = clawStartPositionY

			if (claw.y <= clawStartPositionY) {
				claw.y = clawStartPositionY
			}
		}
	}

	function handleMoveClawX() {
		if (claw.x > claw.targetX && claw.targetX > 0) {
			claw.x -= claw.dx
		} else if (claw.x < claw.targetX && claw.targetX < width) {
			claw.x += claw.dx
		}
	}

	function handleMoveClawOpenAngle() {
		if (claw.angle > claw.targetAngle) {
			claw.angle -= claw.dAngle
		} else {
			claw.angle += claw.dAngle
		}
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			// Handle the null case, or return if canvas isn't available
			return
		}

		const context = canvas.getContext('2d')
		if (!context) {
			// Handle the case where '2d' context isn't supported or return
			return
		}

		const handleClawTouchedBall = () => {
			claw.targetAngle = 0
			claw.targetY = claw.y
		}

		const updateBalls = () => {
			context.clearRect(0, 0, width, height)

			const innerLineStart: IPosition = {x: claw.x, y: claw.y}
			const rightInnerLineMiddle1: IPosition = rotatePoint(
				{x: claw.x + clawSize, y: claw.y + clawSize},
				innerLineStart,
				-claw.angle,
			)
			const rightInnerLineMiddle2: IPosition = rotatePoint(
				{x: claw.x + clawSize, y: claw.y + clawSize + clawSize},
				innerLineStart,
				-claw.angle,
			)
			const rightInnerLineEnd: IPosition = rotatePoint(
				{x: claw.x, y: claw.y + clawSize + clawSize + clawSize},
				innerLineStart,
				-claw.angle,
			)
			const leftInnerLineMiddle1: IPosition = rotatePoint(
				{x: claw.x - clawSize, y: claw.y + clawSize},
				innerLineStart,
				claw.angle,
			)
			const leftInnerLineMiddle2: IPosition = rotatePoint(
				{x: claw.x - clawSize, y: claw.y + clawSize + clawSize},
				innerLineStart,
				claw.angle,
			)
			const leftInnerLineEnd: IPosition = rotatePoint(
				{x: claw.x, y: claw.y + clawSize + clawSize + clawSize},
				innerLineStart,
				claw.angle,
			)

			const outerLineStart: IPosition = {x: claw.x, y: claw.y - clawWidth}
			const rightOuterLineMiddle1: IPosition = rotatePoint(
				{x: claw.x + clawSize + clawWidth, y: claw.y + clawSize - calculateWidth(clawWidth)},
				innerLineStart,
				-claw.angle,
			)
			const rightOuterLineMiddle2: IPosition = rotatePoint(
				{x: claw.x + clawSize + clawWidth, y: claw.y + clawSize + clawSize + calculateWidth(clawWidth)},
				innerLineStart,
				-claw.angle,
			)
			const rightOuterLineEnd: IPosition = rotatePoint(
				{x: claw.x, y: claw.y + clawSize + clawSize + clawSize + clawWidth},
				innerLineStart,
				-claw.angle,
			)
			const leftOuterLineMiddle1: IPosition = rotatePoint(
				{x: claw.x - clawSize - clawWidth, y: claw.y + clawSize - calculateWidth(clawWidth)},
				innerLineStart,
				claw.angle,
			)
			const leftOuterLineMiddle2: IPosition = rotatePoint(
				{x: claw.x - clawSize - clawWidth, y: claw.y + clawSize + clawSize + calculateWidth(clawWidth)},
				innerLineStart,
				claw.angle,
			)
			const leftOuterLineEnd: IPosition = rotatePoint(
				{x: claw.x, y: claw.y + clawSize + clawSize + clawSize + clawWidth},
				innerLineStart,
				claw.angle,
			)

			const dividerLineLeftStart: IPosition = {
				x: width - dividerLineWidth - dividerLineThickness,
				y: dividerLineHeight,
			}
			const dividerLineLeftEnd: IPosition = {x: width - dividerLineWidth - dividerLineThickness, y: height}
			const dividerLineRightStart: IPosition = {x: width - dividerLineWidth, y: dividerLineHeight}
			const dividerLineRightEnd: IPosition = {x: width - dividerLineWidth, y: height}

			const newBallsAfterCollision: IBall[] = balls.map((ball) => {
				ball.dy += gravity

				ball.x += ball.dx
				ball.y += ball.dy

				calculateCollisionWithCanvasEdges(ball, width, height, friction, groundFriction)
				calculateCollisionWithLeftInnerClaw(
					ball,
					innerLineStart,
					leftInnerLineMiddle1,
					leftInnerLineMiddle2,
					leftInnerLineEnd,
					claw,
					handleClawTouchedBall,
				)
				calculateCollisionWithRightInnerClaw(
					ball,
					innerLineStart,
					rightInnerLineMiddle1,
					rightInnerLineMiddle2,
					rightInnerLineEnd,
					claw,
					handleClawTouchedBall,
				)
				calculateCollisionWithRightOuterClaw(
					ball,
					outerLineStart,
					rightOuterLineMiddle1,
					rightOuterLineMiddle2,
					rightOuterLineEnd,
				)
				calculateCollisionWithLeftOuterClaw(
					ball,
					outerLineStart,
					leftOuterLineMiddle1,
					leftOuterLineMiddle2,
					leftOuterLineEnd,
				)
				calculateCollisionWithDividerLines(
					ball,
					dividerLineLeftStart,
					dividerLineLeftEnd,
					dividerLineRightStart,
					dividerLineRightEnd,
				)

				const ballIsInEndZone: boolean = ball.x >= dividerLineRightEnd.x && ball.y >= height - 50

				if (ballIsInEndZone) {
					ball.isInDropZone = true
				}

				return ball
			})

			const removedBalls = newBallsAfterCollision.filter((ball) => ball.isInDropZone)
			const newBalls = newBallsAfterCollision.filter((ball) => !ball.isInDropZone)

			if (removedBalls.length > 0) {
				addToDroppedBalls(removedBalls)
			}

			calculateCollisionsBetweenBalls(balls)

			newBalls.forEach((ball) => {
				drawBall(context, ball)
			})

			drawDividerLine(
				context,
				dividerLineThickness,
				height - dividerLineHeight,
				dividerLineLeftStart,
				dividerLineLeftEnd,
				dividerLineRightStart,
				dividerLineRightEnd,
			)

			balls = newBalls

			if (claw.targetY !== claw.y) {
				handleMoveClawY()
			}

			if (claw.targetX !== claw.x) {
				handleMoveClawX()
			}

			if (claw.angle !== claw.targetAngle) {
				handleMoveClawOpenAngle()
			}

			drawClaw(
				clawWidth,
				context,
				innerLineStart,
				rightInnerLineMiddle1,
				rightInnerLineMiddle2,
				rightInnerLineEnd,
				outerLineStart,
				rightOuterLineMiddle1,
				rightOuterLineMiddle2,
				rightOuterLineEnd,
				leftInnerLineMiddle1,
				leftInnerLineMiddle2,
				leftInnerLineEnd,
				leftOuterLineMiddle1,
				leftOuterLineMiddle2,
				leftOuterLineEnd,
			)
		}

		const interval: NodeJS.Timeout = setInterval(updateBalls, 1000 / 60)
		return () => clearInterval(interval)
	}, [mousePos, claw])

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (!allowUserControl) {
			return
		}

		const canvas = canvasRef.current

		if (!canvas) {
			return
		}

		const rect = canvas.getBoundingClientRect()

		mousePos = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		}

		if (Math.abs(claw.x - mousePos.x) > 10) {
			const nearestEvenNumber: number = Math.round(mousePos.x / 2) * 2
			claw.targetX = nearestEvenNumber
		}
	}

	const moveClaw = (x: number, y: number, angle: number, immediateReturn: boolean = false) => {
		return new Promise<void>((resolve) => {
			allowUserControl = false
			claw.returnOnContact = immediateReturn
			claw.targetX = x
			claw.targetY = y
			claw.targetAngle = angle
			const checkPosition = () => {
				if (
					Math.abs(claw.x - claw.targetX) < claw.dx &&
					Math.abs(claw.y - claw.targetY) < claw.dy &&
					Math.abs(claw.angle - claw.targetAngle) < claw.dAngle
				) {
					allowUserControl = true
					resolve()
				} else {
					requestAnimationFrame(checkPosition)
				}
			}
			requestAnimationFrame(checkPosition)
		})
	}

	const handleMouseDown = async () => {
		if (!allowUserControl) {
			return
		}

		await moveClaw(claw.x, height - 50, 30, true)
		await moveClaw(claw.x, claw.y, 0)
		await moveClaw(claw.x, clawStartPositionY, 0)
		await moveClaw(width - 30, clawStartPositionY, 0)
		await moveClaw(width - 30, clawStartPositionY, 40)
		await moveClaw(Math.round(width / 4) * 2, clawStartPositionY, 0)
	}

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				style={{border: '1px solid black', width: '100%'}}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
			/>
		</div>
	)
}
