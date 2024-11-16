/**
 * Interface representing a ball object used in the simulation.
 * Each ball has properties that control its appearance, initial position, and movement.
 */
export interface IInitialBall {
	/**
	 * Text displayed inside the ball if no icon is provided.
	 * This can be a label or short description.
	 */
	text: string

	/**
	 * The file path or URL to an icon image displayed inside the ball.
	 * If this is defined, it will override the `text` property as the visual content of the ball.
	 */
	icon?: string

	/**
	 * Radius of the ball, in pixels.
	 * If undefined, the default radius specified for the simulation will be used.
	 */
	radius?: number

	/**
	 * Initial X-coordinate position of the ball on the canvas.
	 * If not specified, the X position will be randomly assigned within the canvas bounds.
	 */
	startX?: number

	/**
	 * Initial Y-coordinate position of the ball on the canvas.
	 * If not specified, the Y position will be randomly assigned within the canvas bounds.
	 */
	startY?: number

	/**
	 * Initial horizontal momentum (velocity) of the ball.
	 * Defines the speed and direction in the X-axis when the ball starts moving.
	 * If undefined, a random momentum will be generated.
	 */
	startXMomentum?: number

	/**
	 * Initial vertical momentum (velocity) of the ball.
	 * Defines the speed and direction in the Y-axis when the ball starts moving.
	 * If undefined, a random momentum will be generated.
	 */
	startYMomentum?: number

	/**
	 * Height of the image inside the ball.
	 * If undefined, the image gets adjusted to the ball size
	 */
	imageHeight?: number

	/**
	 * Width of the image inside the ball.
	 * If undefined, the image gets adjusted to the ball size
	 */
	imageWidth?: number

	/**
	 * Color of the ball.
	 * If undefined, defaults to red
	 */
	ballColor?: string

	/**
	 * Font size of the text inside the ball
	 * If undefined, it adjusts to the ball radius
	 */
	ballTextFontSize?: number

	/**
	 * Text Color of the text inside the ball
	 * If undefined, defaults to white
	 */
	ballTextColor?: string
	/**
	 * Vertical alignment of the text inside the ball
	 * If undefined, defaults to center
	 */
	ballTextAlign?: 'center' | 'left' | 'right'

	/**
	 * Horizontal alignment of the text inside the ball
	 * If undefined, defaults to middle
	 */
	ballTextBaseline?: 'middle' | 'top' | 'bottom'
}
