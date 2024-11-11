import {distanceToLineSegment} from './calculationUtils.ts'
import {IBall} from '../interfaces/Ball.ts'
import {IPosition} from '../interfaces/Position.ts'

/**
 * checks if a ball is colliding with a line inside the canvas
 * @param ball the current ball
 * @param x1 start x point of the line
 * @param y1 start y point of the line
 * @param x2 end x point of the line
 * @param y2 end y point of the line
 */
export const isCollidingWithLine = (ball: IBall, x1: number, y1: number, x2: number, y2: number): boolean => {
	return distanceToLineSegment(ball.x, ball.y, x1, y1, x2, y2) < ball.radius
}

/**
 * Adjusts the position of the ball to correct for penetration by moving it along the normal vector.
 *
 * @param ball - The ball object to adjust.
 * @param normal - The normal vector along which to move the ball.
 * @param penetration - The distance to move the ball along the normal vector.
 */
export const adjustBallPosition = (ball: IBall, normal: IPosition, penetration: number) => {
	ball.x += normal.x * penetration
	ball.y += normal.y * penetration
}

/**
 * Handles the response of a ball colliding with a line segment by adjusting the ball's position and velocity.
 *
 * @param ball - The ball object involved in the collision.
 * @param lineStart - The start point of the line segment.
 * @param lineEnd - The end point of the line segment.
 */
export const collisionResponse = (ball: IBall, lineStart: IPosition, lineEnd: IPosition) => {
	const dx: number = lineEnd.x - lineStart.x
	const dy: number = lineEnd.y - lineStart.y
	const length: number = Math.sqrt(dx * dx + dy * dy)
	const normal: IPosition = {x: -dy / length, y: dx / length}

	const distance: number = distanceToLineSegment(ball.x, ball.y, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
	const penetration: number = ball.radius - distance

	adjustBallPosition(ball, normal, penetration)

	const dot: number = ball.dx * normal.x + ball.dy * normal.y
	ball.dx -= 0.5 * dot * normal.x
	ball.dy -= 0.5 * dot * normal.y
}
