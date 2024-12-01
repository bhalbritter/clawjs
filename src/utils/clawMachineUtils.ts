import {IPosition} from '../interfaces/Position.ts'
import {calculateClawWidth, rotatePoint} from './calculationUtils.ts'
import {IClaw} from '../interfaces/Claw.ts'
import {
	calculateCollisionWithCanvasEdges,
	calculateCollisionWithDividerLines,
	calculateCollisionWithLeftInnerClaw,
	calculateCollisionWithLeftOuterClaw,
	calculateCollisionWithRightInnerClaw,
	calculateCollisionWithRightOuterClaw,
} from './collisionChecks.ts'
import {IBall} from '../interfaces/Ball.ts'
import {ICollisionPoints} from '../interfaces/ICollisionPoints.ts'
import {
	getBallInitialXMomentum,
	getBallInitialXPos,
	getBallInitialYMomentum,
	getBallInitialYPos,
	getBallRadius,
} from './ballPositionUtils.ts'
import {IInitialBall} from '../interfaces/InitialBall.ts'

/**
 *  calculates the collision points for the claw and the divider line
 *
 * @param claw the current claw
 * @param clawSize the size of the claw
 * @param clawWidth the width of the claw
 * @param width the width of the canvas
 * @param height the height of the canvas
 * @param dividerLineWidth the space width on the right side of the canvas
 * @param dividerLineThickness the thickness of the divider line itself
 * @param dividerLineHeight the height of the divider line
 */
export const getCollisionPoints = (
	claw: IClaw,
	clawSize: number,
	clawWidth: number,
	width: number,
	height: number,
	dividerLineWidth: number,
	dividerLineThickness: number,
	dividerLineHeight: number,
) => {
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
		{x: claw.x + clawSize + clawWidth, y: claw.y + clawSize - calculateClawWidth(clawWidth)},
		innerLineStart,
		-claw.angle,
	)
	const rightOuterLineMiddle2: IPosition = rotatePoint(
		{x: claw.x + clawSize + clawWidth, y: claw.y + clawSize + clawSize + calculateClawWidth(clawWidth)},
		innerLineStart,
		-claw.angle,
	)
	const rightOuterLineEnd: IPosition = rotatePoint(
		{x: claw.x, y: claw.y + clawSize + clawSize + clawSize + clawWidth},
		innerLineStart,
		-claw.angle,
	)
	const leftOuterLineMiddle1: IPosition = rotatePoint(
		{x: claw.x - clawSize - clawWidth, y: claw.y + clawSize - calculateClawWidth(clawWidth)},
		innerLineStart,
		claw.angle,
	)
	const leftOuterLineMiddle2: IPosition = rotatePoint(
		{x: claw.x - clawSize - clawWidth, y: claw.y + clawSize + clawSize + calculateClawWidth(clawWidth)},
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

	const collisionPoints: ICollisionPoints = {
		innerLineStart,
		rightInnerLineMiddle1,
		rightInnerLineMiddle2,
		rightInnerLineEnd,
		leftInnerLineMiddle1,
		leftInnerLineMiddle2,
		leftInnerLineEnd,
		outerLineStart,
		rightOuterLineMiddle1,
		rightOuterLineMiddle2,
		rightOuterLineEnd,
		leftOuterLineMiddle1,
		leftOuterLineMiddle2,
		leftOuterLineEnd,
		dividerLineLeftStart,
		dividerLineLeftEnd,
		dividerLineRightStart,
		dividerLineRightEnd,
	}

	return collisionPoints
}

/**
 * iterates through all balls and calculates the new positions after the collision with other balls
 *
 * @param balls the list of all balls in the machine
 * @param gravity the current gravity effecting all balls
 * @param width the width of the claw machine
 * @param height the height of the claw machine
 * @param friction the friction if the ball hits another ball
 * @param groundFriction friction if a ball hits the ground
 * @param handleClawTouchedBall function that if called, if a ball touches the inner claw
 * @param claw the current claw
 * @param collisionPoints object that contains all points of the canvas edges, the claw and the divider line to calculate the collisions
 */
export const calculateNewBallPositionsAfterCollision = (
	balls: IBall[],
	gravity: number,
	width: number,
	height: number,
	friction: number,
	groundFriction: number,
	handleClawTouchedBall: () => void,
	claw: IClaw,
	collisionPoints: ICollisionPoints,
) => {
	return balls.map((ball) => {
		ball.dy += gravity

		ball.x += ball.dx
		ball.y += ball.dy

		calculateCollisionWithCanvasEdges(ball, width, height, friction, groundFriction)
		calculateCollisionWithLeftInnerClaw(
			ball,
			collisionPoints.innerLineStart,
			collisionPoints.leftInnerLineMiddle1,
			collisionPoints.leftInnerLineMiddle2,
			collisionPoints.leftInnerLineEnd,
			claw.returnOnContact,
			handleClawTouchedBall,
		)
		calculateCollisionWithRightInnerClaw(
			ball,
			collisionPoints.innerLineStart,
			collisionPoints.rightInnerLineMiddle1,
			collisionPoints.rightInnerLineMiddle2,
			collisionPoints.rightInnerLineEnd,
			claw.returnOnContact,
			handleClawTouchedBall,
		)
		calculateCollisionWithRightOuterClaw(
			ball,
			collisionPoints.outerLineStart,
			collisionPoints.rightOuterLineMiddle1,
			collisionPoints.rightOuterLineMiddle2,
			collisionPoints.rightOuterLineEnd,
		)
		calculateCollisionWithLeftOuterClaw(
			ball,
			collisionPoints.outerLineStart,
			collisionPoints.leftOuterLineMiddle1,
			collisionPoints.leftOuterLineMiddle2,
			collisionPoints.leftOuterLineEnd,
		)
		calculateCollisionWithDividerLines(
			ball,
			collisionPoints.dividerLineLeftStart,
			collisionPoints.dividerLineLeftEnd,
			collisionPoints.dividerLineRightStart,
			collisionPoints.dividerLineRightEnd,
		)

		const ballIsInEndZone: boolean = ball.x >= collisionPoints.dividerLineRightEnd.x && ball.y >= height - 50

		if (ballIsInEndZone) {
			ball.isInDropZone = true
		}

		return ball
	})
}

/**
 * checks if there are balls inside the claw if the claw reaches the upper height of the canvas
 *
 * @param balls all balls in the machine
 * @param dividerLineHeight the height of the divider line
 */
export const checkIfOneOrMoreBallsAreAllGrabbed = (balls: IBall[], dividerLineHeight: number) => {
	return balls.filter((ball) => ball.y <= dividerLineHeight).length > 0
}

/**
 * calculates the new claw y position to reach the targetY position
 *
 * @param claw the current claw
 * @param clawStartPositionY the idle height of the claw
 */
export const calculateNewClawYPosition = (claw: IClaw, clawStartPositionY: number) => {
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

/**
 * calculates the new claw x position to reach the targetX position
 *
 * @param claw the current claw
 * @param width the with of the claw machine
 */
export const calculateNewClawXPosition = (claw: IClaw, width: number) => {
	if (claw.x > claw.targetX && claw.targetX > 0) {
		// Check if the next step overshoots the target
		if (claw.x - claw.dx < claw.targetX) {
			claw.x = claw.targetX
		} else {
			claw.x -= claw.dx
		}
	} else if (claw.x < claw.targetX && claw.targetX < width) {
		// Check if the next step overshoots the target
		if (claw.x + claw.dx > claw.targetX) {
			claw.x = claw.targetX
		} else {
			claw.x += claw.dx
		}
	}
}

/**
 * calculates the new claw angle to reach the target Angle
 *
 * @param claw the current claw
 */
export const calculateNewClawAnglePosition = (claw: IClaw) => {
	if (claw.angle > claw.targetAngle) {
		claw.angle -= claw.dAngle
	} else {
		claw.angle += claw.dAngle
	}
}

/**
 * creates the initial Balls array for array and skips balls that have already been dropped
 *
 * @param balls list of all balls inside the machine
 * @param alreadyDroppedBalls list of already dropped balls
 * @param width with of the claw machine
 * @param height height of the claw machine
 * @param ballRadius standard Radius for the balls (used if no individual ball radius provided)
 * @param dividerLineWidth width of the drop zone on the right side
 */
export const createInitialBalls = (
	balls: IInitialBall[],
	alreadyDroppedBalls: IBall[],
	width: number,
	height: number,
	ballRadius: number,
	dividerLineWidth: number,
) => {
	const initialBalls: IBall[] = []
	balls
		.filter(
			(initialBall) => !alreadyDroppedBalls.find((alreadyDropped) => alreadyDropped.text === initialBall.text),
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
				icon: entry.icon,
				ballColor: entry.ballColor,
				ballTextFontSize: entry.ballTextFontSize,
				ballTextAlign: entry.ballTextAlign,
				ballTextBaseline: entry.ballTextBaseline,
				ballTextColor: entry.ballTextColor,
				imageHeight: entry.imageHeight,
				imageWidth: entry.imageWidth,
			})
		})
	return initialBalls
}
