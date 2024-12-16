import React, {useRef, useEffect, forwardRef, useImperativeHandle} from 'react'
import {IBall} from './interfaces/Ball.ts'
import {IPosition} from './interfaces/Position.ts'
import {IClaw} from './interfaces/Claw.ts'
import {drawBall, drawClaw, drawDividerLine, preloadImagesForBalls} from './utils/drawUtils.ts'
import {calculateCollisionsBetweenBalls} from './utils/collisionChecks.ts'
import {IInitialBall} from './interfaces/InitialBall.ts'
import {
	calculateNewBallPositionsAfterCollision,
	calculateNewClawAnglePosition,
	calculateNewClawXPosition,
	calculateNewClawYPosition,
	checkIfOneOrMoreBallsAreAllGrabbed,
	createInitialBalls,
	getCollisionPoints,
} from './utils/clawMachineUtils.ts'
import {ICollisionPoints} from './interfaces/ICollisionPoints.ts'
import {calculateBoundary} from './utils/calculationUtils.ts'

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
	 * Fill color of the divider line.
	 * Defaults to `gray`.
	 */
	readonly dividerLineFillColor?: string

	/**
	 * Border color of the divider line.
	 * Defaults to `gray`.
	 */
	readonly dividerLineBorderColor?: string

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
	 * Horizontal speed of the claw during movement.
	 * Defaults to `2`.
	 */
	readonly clawSpeedX?: number

	/**
	 * Vertical speed of the claw during movement.
	 * Defaults to `1.1`.
	 */
	readonly clawSpeedY?: number

	/**
	 * Opening speed  of the claw.
	 * Defaults to `1`.
	 */
	readonly clawOpenSpeed?: number

	/**
	 * Color of the claw
	 * Defaults to `gray`.
	 */
	readonly clawColor?: string

	/**
	 * Color of the bolt holding the claw together
	 * Defaults to `black`.
	 */
	readonly clawBoltColor?: string

	/**
	 * Radius of each ball in pixels. Defaults to `20`.
	 */
	readonly ballRadius?: number

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

/**
 * API for controlling the ClawMachine component.
 */
export interface ClawMachineCommands {
	/**
	 * Moves the claw to a specific position and resolves a Promise when the position is reached.
	 *
	 * **Parameters:**
	 * - `x`: The desired x-coordinate for the claw.
	 * - `y`: The desired y-coordinate for the claw.
	 * - `angle`: The desired angle for the claw's open/closed state (e.g., 0 for closed, 45 for half-open).
	 * - `immediateReturn` (optional): If `true`, the claw immediately returns to the starting position after reaching the target. Defaults to `false`.
	 *
	 * @param x - The desired x-coordinate for the claw.
	 * @param y - The desired y-coordinate for the claw.
	 * @param angle - The desired angle for the claw's open/closed state.
	 * @param immediateReturn - (Optional) If true, the claw closes if it touches a ball and throws it to the exit area.
	 * @returns A Promise that resolves when the claw reaches the specified position.
	 */
	moveClaw: (x: number, y: number, angle: number, immediateReturn?: boolean) => Promise<void>
	/**
	 * Moves the claw to the right by the claw dx speed as long as stopMoving is not called
	 */
	moveClawRight: () => void
	/**
	 * Moves the claw to the left by the claw dx speed as long as stopMoving is not called
	 */
	moveClawLeft: () => void
	/**
	 * Stops the current claw Movement triggered by moveClawRight() or moveClawLeft()
	 */
	stopMoving: () => void
	/**
	 * Moves the claw down and tries to grab a ball
	 */
	moveClawDown: () => Promise<void>
}
export const ClawMachine = forwardRef<ClawMachineCommands, IClawMachineProps>(
	(
		{
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
			dividerLineFillColor = 'gray',
			dividerLineBorderColor = 'gray',
			clawWidth = 10,
			clawStartPositionX = 200,
			clawStartPositionY = 40,
			clawStartOpenAngle = 0,
			clawSpeedX = 2,
			clawSpeedY = 1.1,
			clawOpenSpeed = 1,
			clawColor = 'gray',
			clawBoltColor = 'black',
			ballRadius = 20,
			alreadyDroppedBalls,
			addToDroppedBalls,
		},
		ref,
	): React.ReactElement => {
		const canvasRef = useRef<HTMLCanvasElement | null>(null)
		const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
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

		if (balls.length === 0) {
			balls = createInitialBalls(ballData, alreadyDroppedBalls, width, height, ballRadius, dividerLineWidth)
			preloadImagesForBalls(balls) // Preload images for all balls
		}

		function handleMoveClawY() {
			calculateNewClawYPosition(claw, clawStartPositionY)
		}

		function handleMoveClawX() {
			calculateNewClawXPosition(claw, width)
		}

		function handleMoveClawOpenAngle() {
			calculateNewClawAnglePosition(claw)
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

				const collisionPoints: ICollisionPoints = getCollisionPoints(
					claw,
					clawSize,
					clawWidth,
					width,
					height,
					dividerLineWidth,
					dividerLineThickness,
					dividerLineHeight,
				)

				const newBallsAfterCollision: IBall[] = calculateNewBallPositionsAfterCollision(
					balls,
					gravity,
					width,
					height,
					friction,
					groundFriction,
					handleClawTouchedBall,
					claw,
					collisionPoints,
				)

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
					collisionPoints,
					dividerLineFillColor,
					dividerLineBorderColor,
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

				drawClaw(clawWidth, context, collisionPoints, clawColor, clawBoltColor)
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
			if (Math.abs(claw.x - mousePos.x) > 20) {
				claw.targetX = Math.round(mousePos.x / 2) * 2 // move to nearest even number
			}
		}

		const handleMoveClawWithButton = async (addValue: number) => {
			// Replace this with your actual moveClaw function
			await moveClaw(claw.x + addValue, claw.y, claw.angle, false)
		}

		/**
		 * Stops the current claw Movement triggered by moveClawRight() or moveClawLeft()
		 */
		const stopMoving = () => {
			if (moveIntervalRef.current !== null) {
				clearInterval(moveIntervalRef.current!)
				moveIntervalRef.current = null
			}
		}

		/**
		 * Moves the claw to the right by the claw dx speed as long as stopMoving is not called
		 */
		const moveClawRight = () => {
			if (!allowUserControl) {
				return
			}

			moveIntervalRef.current = setInterval(() => {
				handleMoveClawWithButton(claw.dx)
			}, 5)
		}

		/**
		 * Moves the claw to the left by the claw dx speed as long as stopMoving is not called
		 */
		const moveClawLeft = () => {
			if (!allowUserControl) {
				return
			}

			moveIntervalRef.current = setInterval(() => {
				handleMoveClawWithButton(-claw.dx)
			}, 5)
		}

		/**
		 * Moves the claw to a specific position and returns a Promise if the position is reached
		 *
		 * @param x The desired x position
		 * @param y the desired y position
		 * @param angle the desired end angle
		 * @param immediateReturn if this property is true, the claw closes if it touches a ball on the inside and throws it to the exit area
		 */
		const moveClaw = (x: number, y: number, angle: number, immediateReturn: boolean = false) => {
			return new Promise<void>((resolve) => {
				allowUserControl = false
				claw.returnOnContact = immediateReturn
				claw.targetX = calculateBoundary(x, width)
				claw.targetY = calculateBoundary(y, height)
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

		const moveClawDown = async () => {
			if (!allowUserControl) {
				return
			}

			await moveClaw(claw.x, height - 50, 30, true)
			await moveClaw(claw.x, claw.y, 0)
			await moveClaw(claw.x, clawStartPositionY, 0)
			if (checkIfOneOrMoreBallsAreAllGrabbed(balls, dividerLineHeight)) {
				await moveClaw(width - 30, clawStartPositionY, 0)
				await moveClaw(width - 30, clawStartPositionY, 40)
				await moveClaw(Math.round(width / 4) * 2, clawStartPositionY, 0)
			}
		}

		useImperativeHandle(ref, () => ({
			moveClaw,
			moveClawRight,
			moveClawLeft,
			stopMoving,
			moveClawDown,
		}))

		return (
			<div>
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					style={{border: '1px solid black', width: '100%'}}
					onMouseMove={handleMouseMove}
					onMouseDown={moveClawDown}
				/>
			</div>
		)
	},
)
