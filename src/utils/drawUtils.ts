import {IPosition} from '../interfaces/Position.ts'
import {IBall} from '../interfaces/Ball.ts'

/**
 * Draws the claw on the given canvas context.
 *
 * @param clawWidth - size of the claw
 * @param context - The canvas rendering context.
 * @param innerLineStart - The starting position of the inner line.
 * @param rightInnerLineMiddle1 - The first middle position of the right inner line.
 * @param rightInnerLineMiddle2 - The second middle position of the right inner line.
 * @param rightInnerLineEnd - The ending position of the right inner line.
 * @param outerLineStart - The starting position of the outer line.
 * @param rightOuterLineMiddle1 - The first middle position of the right outer line.
 * @param rightOuterLineMiddle2 - The second middle position of the right outer line.
 * @param rightOuterLineEnd - The ending position of the right outer line.
 * @param leftInnerLineMiddle1 - The first middle position of the left inner line.
 * @param leftInnerLineMiddle2 - The second middle position of the left inner line.
 * @param leftInnerLineEnd - The ending position of the left inner line.
 * @param leftOuterLineMiddle1 - The first middle position of the left outer line.
 * @param leftOuterLineMiddle2 - The second middle position of the left outer line.
 * @param leftOuterLineEnd - The ending position of the left outer line.
 */
export function drawClaw(
	clawWidth: number,
	context: CanvasRenderingContext2D,
	innerLineStart: IPosition,
	rightInnerLineMiddle1: IPosition,
	rightInnerLineMiddle2: IPosition,
	rightInnerLineEnd: IPosition,
	outerLineStart: IPosition,
	rightOuterLineMiddle1: IPosition,
	rightOuterLineMiddle2: IPosition,
	rightOuterLineEnd: IPosition,
	leftInnerLineMiddle1: IPosition,
	leftInnerLineMiddle2: IPosition,
	leftInnerLineEnd: IPosition,
	leftOuterLineMiddle1: IPosition,
	leftOuterLineMiddle2: IPosition,
	leftOuterLineEnd: IPosition,
) {
	context.beginPath()
	context.moveTo(innerLineStart.x, innerLineStart.y)
	context.lineTo(innerLineStart.x, 0)
	context.strokeStyle = 'gray'
	context.lineWidth = clawWidth / 2
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(innerLineStart.x, innerLineStart.y)
	context.lineTo(rightInnerLineMiddle1.x, rightInnerLineMiddle1.y)
	context.lineTo(rightInnerLineMiddle2.x, rightInnerLineMiddle2.y)
	context.lineTo(rightInnerLineEnd.x, rightInnerLineEnd.y)
	context.strokeStyle = 'gray'
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(outerLineStart.x, outerLineStart.y)
	context.lineTo(rightOuterLineMiddle1.x, rightOuterLineMiddle1.y)
	context.lineTo(rightOuterLineMiddle2.x, rightOuterLineMiddle2.y)
	context.lineTo(rightOuterLineEnd.x, rightOuterLineEnd.y)
	context.strokeStyle = 'gray'
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(innerLineStart.x, innerLineStart.y)
	context.lineTo(leftInnerLineMiddle1.x, leftInnerLineMiddle1.y)
	context.lineTo(leftInnerLineMiddle2.x, leftInnerLineMiddle2.y)
	context.lineTo(leftInnerLineEnd.x, leftInnerLineEnd.y)
	context.strokeStyle = 'gray'
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(outerLineStart.x, outerLineStart.y)
	context.lineTo(leftOuterLineMiddle1.x, leftOuterLineMiddle1.y)
	context.lineTo(leftOuterLineMiddle2.x, leftOuterLineMiddle2.y)
	context.lineTo(leftOuterLineEnd.x, leftOuterLineEnd.y)
	context.strokeStyle = 'gray'
	context.lineWidth = clawWidth
	context.stroke()
	context.closePath()

	context.beginPath()
	context.arc(outerLineStart.x, outerLineStart.y + clawWidth / 1.5, clawWidth / 2, 0, Math.PI * 2, false)
	context.fillStyle = 'black'
	context.fill()
	context.closePath()
}

/**
 * Draws the divider line on the given canvas context.
 *
 * @param context - The canvas rendering context.
 * @param dividerLineWidth - Width of the divider Line.
 * @param dividerLineHeight - Height of the divider Line.
 * @param dividerLineLeftStart - The starting position of the left line.
 * @param dividerLineLeftEnd - The end position of the left line.
 * @param dividerLineRightStart - The starting position of the right line.
 * @param dividerLineRightEnd - The starting position of the right line.
 */
export function drawDividerLine(
	context: CanvasRenderingContext2D,
	dividerLineWidth: number,
	dividerLineHeight: number,
	dividerLineLeftStart: IPosition,
	dividerLineLeftEnd: IPosition,
	dividerLineRightStart: IPosition,
	dividerLineRightEnd: IPosition,
) {
	context.beginPath()
	context.moveTo(dividerLineLeftStart.x, dividerLineLeftStart.y)
	context.lineTo(dividerLineLeftEnd.x, dividerLineLeftEnd.y)
	context.strokeStyle = 'black'
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(dividerLineRightStart.x, dividerLineRightStart.y)
	context.lineTo(dividerLineRightEnd.x, dividerLineRightEnd.y)
	context.strokeStyle = 'black'
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.beginPath()
	context.moveTo(dividerLineRightStart.x, dividerLineRightStart.y)
	context.lineTo(dividerLineLeftStart.x, dividerLineLeftStart.y)
	context.strokeStyle = 'black'
	context.lineWidth = 1
	context.stroke()
	context.closePath()

	context.fillStyle = 'gray'
	context.fillRect(dividerLineLeftStart.x, dividerLineLeftStart.y, dividerLineWidth, dividerLineHeight)
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
		img.src = '../../../../../icons/' + iconPath
		img.onload = () => resolve(img)
	})
}

/**
 * creates the imageCache by loading all images so they do not have to be loaded from scratch on every rerender
 * @param balls initial Balls array with icon paths
 */
export async function preloadImagesForBalls(balls: IBall[]) {
	for (const ball of balls) {
		if (ball.iconPath && !imageCache[ball.iconPath]) {
			imageCache[ball.iconPath] = await preloadImage(ball.iconPath)
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

	if (ball.iconPath) {
		const img = imageCache[ball.iconPath]
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
