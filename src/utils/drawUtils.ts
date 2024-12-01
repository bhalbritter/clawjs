import {IBall} from '../interfaces/Ball.ts'
import {ICollisionPoints} from '../interfaces/ICollisionPoints.ts'

/**
 * Draws the claw on the given canvas context.
 *
 * @param clawWidth - size of the claw
 * @param context - The canvas rendering context.
 * @param collisionPoints - Objects, that hold all points to draw the Claw
 * @param clawColor - Color of the claw
 * @param clawBoltColor - Color of the Bolt inside the claw
 */
export function drawClaw(
	clawWidth: number,
	context: CanvasRenderingContext2D,
	collisionPoints: ICollisionPoints,
	clawColor: string,
	clawBoltColor: string,
) {
	context.beginPath()
	context.moveTo(collisionPoints.innerLineStart.x, collisionPoints.innerLineStart.y)
	context.lineTo(collisionPoints.innerLineStart.x, 0)
	context.strokeStyle = clawColor
	context.lineWidth = clawWidth / 2
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.innerLineStart.x, collisionPoints.innerLineStart.y)
	context.lineTo(collisionPoints.rightInnerLineMiddle1.x, collisionPoints.rightInnerLineMiddle1.y)
	context.lineTo(collisionPoints.rightInnerLineMiddle2.x, collisionPoints.rightInnerLineMiddle2.y)
	context.lineTo(collisionPoints.rightInnerLineEnd.x, collisionPoints.rightInnerLineEnd.y)
	context.strokeStyle = clawColor
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.outerLineStart.x, collisionPoints.outerLineStart.y)
	context.lineTo(collisionPoints.rightOuterLineMiddle1.x, collisionPoints.rightOuterLineMiddle1.y)
	context.lineTo(collisionPoints.rightOuterLineMiddle2.x, collisionPoints.rightOuterLineMiddle2.y)
	context.lineTo(collisionPoints.rightOuterLineEnd.x, collisionPoints.rightOuterLineEnd.y)
	context.strokeStyle = clawColor
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.innerLineStart.x, collisionPoints.innerLineStart.y)
	context.lineTo(collisionPoints.leftInnerLineMiddle1.x, collisionPoints.leftInnerLineMiddle1.y)
	context.lineTo(collisionPoints.leftInnerLineMiddle2.x, collisionPoints.leftInnerLineMiddle2.y)
	context.lineTo(collisionPoints.leftInnerLineEnd.x, collisionPoints.leftInnerLineEnd.y)
	context.strokeStyle = clawColor
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.outerLineStart.x, collisionPoints.outerLineStart.y)
	context.lineTo(collisionPoints.leftOuterLineMiddle1.x, collisionPoints.leftOuterLineMiddle1.y)
	context.lineTo(collisionPoints.leftOuterLineMiddle2.x, collisionPoints.leftOuterLineMiddle2.y)
	context.lineTo(collisionPoints.leftOuterLineEnd.x, collisionPoints.leftOuterLineEnd.y)
	context.strokeStyle = clawColor
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.arc(
		collisionPoints.outerLineStart.x,
		collisionPoints.outerLineStart.y + clawWidth / 1.5,
		clawWidth / 2,
		0,
		Math.PI * 2,
		false,
	)
	context.fillStyle = clawBoltColor
	context.fill()
	context.closePath()
}

/**
 * Draws the divider line on the given canvas context.
 *
 * @param context - The canvas rendering context.
 * @param dividerLineWidth - Width of the divider Line.
 * @param dividerLineHeight - Height of the divider Line.
 * @param collisionPoints - Objects, that hold all points to draw the dividerLine
 * @param dividerLineFillColor - Fill Color of the divider
 * @param dividerLineBorderColor - Border Color of the divider itself
 */
export function drawDividerLine(
	context: CanvasRenderingContext2D,
	dividerLineWidth: number,
	dividerLineHeight: number,
	collisionPoints: ICollisionPoints,
	dividerLineFillColor: string,
	dividerLineBorderColor: string,
) {
	context.beginPath()
	context.moveTo(collisionPoints.dividerLineLeftStart.x, collisionPoints.dividerLineLeftStart.y)
	context.lineTo(collisionPoints.dividerLineLeftEnd.x, collisionPoints.dividerLineLeftEnd.y)
	context.strokeStyle = dividerLineBorderColor
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.dividerLineRightStart.x, collisionPoints.dividerLineRightStart.y)
	context.lineTo(collisionPoints.dividerLineRightEnd.x, collisionPoints.dividerLineRightEnd.y)
	context.strokeStyle = dividerLineBorderColor
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(collisionPoints.dividerLineRightStart.x, collisionPoints.dividerLineRightStart.y)
	context.lineTo(collisionPoints.dividerLineLeftStart.x, collisionPoints.dividerLineLeftStart.y)
	context.strokeStyle = dividerLineBorderColor
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.fillStyle = dividerLineFillColor
	context.fillRect(
		collisionPoints.dividerLineLeftStart.x,
		collisionPoints.dividerLineLeftStart.y,
		dividerLineWidth,
		dividerLineHeight,
	)
}

//cache for the different icons to prevent flickering
interface ImageCache {
	[key: string]: HTMLImageElement | undefined // Adjust the type as needed
}

const imageCache: ImageCache = {}

/**
 * returns the fully loaded image as promise to save it in the image cache
 * @param iconPath name of the icon
 */
function preloadImage(iconPath: string) {
	return new Promise<HTMLImageElement>((resolve) => {
		const img = new Image()
		img.src = iconPath
		img.onload = () => resolve(img)
	})
}

/**
 * creates the imageCache by loading all images so they do not have to be loaded from scratch on every rerender
 * @param balls initial Balls array with icon paths
 */
export async function preloadImagesForBalls(balls: IBall[]) {
	for (const ball of balls) {
		if (ball.icon && !imageCache[ball.icon]) {
			imageCache[ball.icon] = await preloadImage(ball.icon)
		}
	}
}

/**
 * Draws the ball on the given canvas context.
 *
 * @param context - The canvas rendering context.
 * @param ball - The current ball to draw.
 */
export function drawBall(context: CanvasRenderingContext2D, ball: IBall) {
	const defaultFontSize = ball.radius / 2
	const defaultFontColor = 'white'
	const defaultTextAlign: CanvasTextAlign = 'center'
	const defaultTextBaseline: CanvasTextBaseline = 'middle'
	const defaultBallColor = 'red'

	context.beginPath()
	context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false)
	context.fillStyle = ball.ballColor || defaultBallColor
	context.fill()
	context.closePath()

	if (ball.icon) {
		const img = imageCache[ball.icon]
		if (img) {
			context.drawImage(
				img,
				ball.x - (ball.imageWidth || ball.radius * 1.4) / 2,
				ball.y - (ball.imageHeight || ball.radius * 1.4) / 2,
				ball.imageWidth || ball.radius * 1.4,
				ball.imageHeight || ball.radius * 1.4,
			)
		}
	} else {
		// Draw the text if no icon is available
		context.font = `${ball.ballTextFontSize || defaultFontSize}px Arial`
		context.fillStyle = ball.ballTextColor || defaultFontColor
		context.textAlign = ball.ballTextAlign || defaultTextAlign
		context.textBaseline = ball.ballTextBaseline || defaultTextBaseline

		context.fillText(ball.text, ball.x, ball.y)
	}
}
