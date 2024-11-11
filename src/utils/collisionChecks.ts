import {collisionResponse, isCollidingWithLine} from './collisionUtils.ts'
import {IBall} from '../interfaces/Ball.ts'
import {IPosition} from '../interfaces/Position.ts'
import {IClaw} from '../interfaces/Claw.ts'

/**
 * checks weather the ball has collided with the left inner claw. And handle the collision (push it inside)
 * @param ball the current ball
 * @param leftLineStart start point of the left inner claw
 * @param leftLineMiddle1 upper mid-point of the left inner claw
 * @param leftLineMiddle2 lower mid-point of the left inner claw
 * @param leftLineEnd end point of the left inner claw
 * @param claw the claw object
 * @param handleBallTouched function that gets called if the claw touches a ball
 */
export function calculateCollisionWithLeftInnerClaw(
	ball: IBall,
	leftLineStart: IPosition,
	leftLineMiddle1: IPosition,
	leftLineMiddle2: IPosition,
	leftLineEnd: IPosition,
	claw: IClaw,
	handleBallTouched: () => void,
) {
	// Check collisions with claw lines
	const collidingWithLeftUpperInnerLine: boolean = isCollidingWithLine(
		ball,
		leftLineStart.x,
		leftLineStart.y,
		leftLineMiddle1.x,
		leftLineMiddle1.y,
	)
	const collidingWithLeftMiddleInnerLine: boolean = isCollidingWithLine(
		ball,
		leftLineMiddle2.x,
		leftLineMiddle2.y,
		leftLineMiddle1.x,
		leftLineMiddle1.y,
	)
	const collidingWithLeftLowerInnerLine: boolean = isCollidingWithLine(
		ball,
		leftLineEnd.x,
		leftLineEnd.y,
		leftLineMiddle2.x,
		leftLineMiddle2.y,
	)

	if (collidingWithLeftUpperInnerLine || collidingWithLeftMiddleInnerLine || collidingWithLeftLowerInnerLine) {
		if (claw.returnOnContact) {
			handleBallTouched()
		}

		if (collidingWithLeftUpperInnerLine) {
			collisionResponse(ball, leftLineMiddle1, leftLineStart)
		}
		if (collidingWithLeftMiddleInnerLine) {
			collisionResponse(ball, leftLineMiddle2, leftLineMiddle1)
		}
		if (collidingWithLeftLowerInnerLine) {
			collisionResponse(ball, leftLineEnd, leftLineMiddle2)
		}
	}
}

/**
 * checks weather the ball has collided with the right inner claw. And handle the collision (push it inside)
 * @param ball the current ball
 * @param rightLineStart start point of the right inner claw
 * @param rightLineMiddle1 upper mid-point of the right inner claw
 * @param rightLineMiddle2 lower mid-point of the right inner claw
 * @param rightLineEnd end point of the right inner claw
 * @param claw the claw object
 * @param handleBallTouched function that gets called if the claw touches a ball
 */
export function calculateCollisionWithRightInnerClaw(
	ball: IBall,
	rightLineStart: IPosition,
	rightLineMiddle1: IPosition,
	rightLineMiddle2: IPosition,
	rightLineEnd: IPosition,
	claw: IClaw,
	handleBallTouched: () => void,
) {
	const collidingWithRightUpperInnerLine: boolean = isCollidingWithLine(
		ball,
		rightLineStart.x,
		rightLineStart.y,
		rightLineMiddle1.x,
		rightLineMiddle1.y,
	)
	const collidingWithRightMiddleInnerLine: boolean = isCollidingWithLine(
		ball,
		rightLineMiddle1.x,
		rightLineMiddle1.y,
		rightLineMiddle2.x,
		rightLineMiddle2.y,
	)
	const collidingWithRightLowerInnerLine: boolean = isCollidingWithLine(
		ball,
		rightLineMiddle2.x,
		rightLineMiddle2.y,
		rightLineEnd.x,
		rightLineEnd.y,
	)

	if (collidingWithRightUpperInnerLine || collidingWithRightMiddleInnerLine || collidingWithRightLowerInnerLine) {
		if (claw.returnOnContact) {
			handleBallTouched()
		}

		if (collidingWithRightUpperInnerLine) {
			collisionResponse(ball, rightLineStart, rightLineMiddle1)
		}
		if (collidingWithRightMiddleInnerLine) {
			collisionResponse(ball, rightLineMiddle1, rightLineMiddle2)
		}
		if (collidingWithRightLowerInnerLine) {
			collisionResponse(ball, rightLineMiddle2, rightLineEnd)
		}
	}
}

/**
 * checks weather the ball has collided with the right outer claw. And handle the collision (push it outside)
 * @param ball the current ball
 * @param rightOuterLineStart start point of the right outer claw
 * @param rightOuterLineMiddle1 upper mid-point of the right outer claw
 * @param rightOuterLineMiddle2 lower mid-point of the right outer claw
 * @param rightOuterLineEnd end point of the right outer claw
 */
export function calculateCollisionWithRightOuterClaw(
	ball: IBall,
	rightOuterLineStart: IPosition,
	rightOuterLineMiddle1: IPosition,
	rightOuterLineMiddle2: IPosition,
	rightOuterLineEnd: IPosition,
) {
	const collidingWithRightUpperOuterLine: boolean = isCollidingWithLine(
		ball,
		rightOuterLineStart.x,
		rightOuterLineStart.y,
		rightOuterLineMiddle1.x,
		rightOuterLineMiddle1.y,
	)
	const collidingWithRightMiddleOuterLine: boolean = isCollidingWithLine(
		ball,
		rightOuterLineMiddle1.x,
		rightOuterLineMiddle1.y,
		rightOuterLineMiddle2.x,
		rightOuterLineMiddle2.y,
	)
	const collidingWithRightLowerOuterLine: boolean = isCollidingWithLine(
		ball,
		rightOuterLineMiddle2.x,
		rightOuterLineMiddle2.y,
		rightOuterLineEnd.x,
		rightOuterLineEnd.y,
	)

	if (collidingWithRightUpperOuterLine || collidingWithRightMiddleOuterLine || collidingWithRightLowerOuterLine) {
		if (collidingWithRightUpperOuterLine) {
			collisionResponse(ball, rightOuterLineMiddle1, rightOuterLineStart)
		}
		if (collidingWithRightMiddleOuterLine) {
			collisionResponse(ball, rightOuterLineMiddle2, rightOuterLineMiddle1)
		}
		if (collidingWithRightLowerOuterLine) {
			collisionResponse(ball, rightOuterLineEnd, rightOuterLineMiddle2)
		}
	}
}

/**
 * checks weather the ball has collided with the left outer claw. And handle the collision (push it outside)
 * @param ball the current ball
 * @param leftOuterLineStart start point of the left outer claw
 * @param leftOuterLineMiddle1 upper mid-point of the left outer claw
 * @param leftOuterLineMiddle2 lower mid-point of the left outer claw
 * @param leftOuterLineEnd end point of the left outer claw
 */
export function calculateCollisionWithLeftOuterClaw(
	ball: IBall,
	leftOuterLineStart: IPosition,
	leftOuterLineMiddle1: IPosition,
	leftOuterLineMiddle2: IPosition,
	leftOuterLineEnd: IPosition,
) {
	const collidingWithLeftUpperOuterLine: boolean = isCollidingWithLine(
		ball,
		leftOuterLineStart.x,
		leftOuterLineStart.y,
		leftOuterLineMiddle1.x,
		leftOuterLineMiddle1.y,
	)
	const collidingWithLeftMiddleOuterLine: boolean = isCollidingWithLine(
		ball,
		leftOuterLineMiddle1.x,
		leftOuterLineMiddle1.y,
		leftOuterLineMiddle2.x,
		leftOuterLineMiddle2.y,
	)
	const collidingWithLeftLowerOuterLine: boolean = isCollidingWithLine(
		ball,
		leftOuterLineMiddle2.x,
		leftOuterLineMiddle2.y,
		leftOuterLineEnd.x,
		leftOuterLineEnd.y,
	)

	if (collidingWithLeftUpperOuterLine || collidingWithLeftMiddleOuterLine || collidingWithLeftLowerOuterLine) {
		if (collidingWithLeftUpperOuterLine) {
			collisionResponse(ball, leftOuterLineStart, leftOuterLineMiddle1)
		}
		if (collidingWithLeftMiddleOuterLine) {
			collisionResponse(ball, leftOuterLineMiddle1, leftOuterLineMiddle2)
		}
		if (collidingWithLeftLowerOuterLine) {
			collisionResponse(ball, leftOuterLineMiddle2, leftOuterLineEnd)
		}
	}
}

/**
 * calculates the collision with the divider line in the middle of the canvas
 * @param ball the current ball
 * @param dividerLineLeftStart start point of the left divider Line
 * @param dividerLineLeftEnd end point of the left divider Line
 * @param dividerLineRightStart start point of the right divider Line
 * @param dividerLineRightEnd end point of the right divider Line
 */
export function calculateCollisionWithDividerLines(
	ball: IBall,
	dividerLineLeftStart: IPosition,
	dividerLineLeftEnd: IPosition,
	dividerLineRightStart: IPosition,
	dividerLineRightEnd: IPosition,
) {
	const collisionWithLeftDividerLine: boolean = isCollidingWithLine(
		ball,
		dividerLineLeftStart.x,
		dividerLineLeftStart.y,
		dividerLineLeftEnd.x,
		dividerLineLeftEnd.y,
	)
	const collisionWithRightDividerLine: boolean = isCollidingWithLine(
		ball,
		dividerLineRightStart.x,
		dividerLineRightStart.y,
		dividerLineRightEnd.x,
		dividerLineRightEnd.y,
	)

	// is colliding with divider Line
	if (collisionWithLeftDividerLine || collisionWithRightDividerLine) {
		if (collisionWithLeftDividerLine) {
			collisionResponse(ball, dividerLineLeftStart, dividerLineLeftEnd)
		}
		if (collisionWithRightDividerLine) {
			collisionResponse(ball, dividerLineRightEnd, dividerLineRightStart)
		}
	}
}

/**
 * calculates the collision with the canvas edges
 * @param ball current ball
 * @param width width of the canvas
 * @param height height of the canvas
 * @param friction friction of the canvas edges
 * @param groundFriction friction of the canvas ground
 */
export function calculateCollisionWithCanvasEdges(
	ball: IBall,
	width: number,
	height: number,
	friction: number,
	groundFriction: number,
) {
	if (ball.x + ball.radius > width) {
		ball.dx = -ball.dx * friction
		ball.x = width - ball.radius
	} else if (ball.x - ball.radius < 0) {
		ball.dx = -ball.dx * friction
		ball.x = ball.radius
	}

	if (ball.y + ball.radius > height) {
		ball.dy = -ball.dy * groundFriction
		ball.y = height - ball.radius

		ball.dx *= groundFriction

		if (Math.abs(ball.dy) < 0.1) {
			ball.dy = 0
		}
		if (Math.abs(ball.dx) < 0.1) {
			ball.dx = 0
		}
	} else if (ball.y - ball.radius < 0) {
		ball.dy = -ball.dy * friction
		ball.y = ball.radius
	}
}

/**
 * calculates the collision between all the balls
 * @param balls list of the balls inside the canvas
 */
export function calculateCollisionsBetweenBalls(balls: IBall[]) {
	for (let i: number = 0; i < balls.length; i++) {
		for (let j: number = i + 1; j < balls.length; j++) {
			const ball1: IBall = balls[i]
			const ball2: IBall = balls[j]
			const dx: number = ball2.x - ball1.x
			const dy: number = ball2.y - ball1.y
			const distance: number = Math.sqrt(dx * dx + dy * dy)
			const minDistance: number = ball1.radius + ball2.radius

			if (distance < minDistance) {
				// Calculate the overlap
				const overlap: number = (minDistance - distance) / 2

				// Calculate angle, sine, and cosine
				const angle: number = Math.atan2(dy, dx)
				const sin: number = Math.sin(angle)
				const cos: number = Math.cos(angle)

				// Calculate the new positions to separate the balls
				ball1.x -= overlap * cos
				ball1.y -= overlap * sin
				ball2.x += overlap * cos
				ball2.y += overlap * sin

				// Rotate velocities to the collision angle
				const v1: IPosition = {x: ball1.dx * cos + ball1.dy * sin, y: ball1.dy * cos - ball1.dx * sin}
				const v2: IPosition = {x: ball2.dx * cos + ball2.dy * sin, y: ball2.dy * cos - ball2.dx * sin}

				// Swap the x component of the velocities
				const temp: number = v1.x
				v1.x = v2.x
				v2.x = temp

				// Rotate velocities back
				ball1.dx = 0.5 * v1.x * cos - v1.y * sin
				ball1.dy = 0.5 * v1.y * cos + v1.x * sin
				ball2.dx = 0.5 * v2.x * cos - v2.y * sin
				ball2.dy = 0.5 * v2.y * cos + v2.x * sin
			}
		}
	}
}
