/**
 * Interface representing a ball object used in the simulation.
 * Each ball has properties that control its appearance, initial position, and movement.
 */
export interface IInitialBall {
	/**
	 * Text displayed inside the ball if no icon is provided.
	 * This can be a label or short description.
	 * TODO: Consider allowing content to be a React Node for more flexible content types.
	 */
	text: string

	/**
	 * Array of paragraphs or descriptions related to this ball.
	 * Can be used to display additional information associated with this ball.
	 */
	paragraph: string[]

	/**
	 * The color of the ball. Should be a valid color string (e.g., "red", "#FF0000").
	 * TODO: Change this to accept only hex color codes for consistency.
	 */
	color: string

	/**
	 * The file path or URL to an icon image displayed inside the ball.
	 * If this is defined, it will override the `text` property as the visual content of the ball.
	 */
	iconPath: string

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
}
