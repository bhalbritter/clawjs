/**
 * Returns the Ball Radius for the current Ball to be inserted into the Machine
 *
 * @param individualBallRadius The individual Ball radius if it is overwritten
 * @param generalBallRadius The general Ball radius that is also used as fallback
 */
export const getBallRadius = (individualBallRadius: number | undefined, generalBallRadius: number): number => {
	if (individualBallRadius) {
		if (individualBallRadius < 0) {
			return generalBallRadius
		} else {
			return individualBallRadius
		}
	}

	return generalBallRadius
}

/**
 * Returns the Initial X value of the Ball that is defined by the user and if it is not it returns a random x position
 *
 * @param xPosValue The explicit X position of the new ball if it es defined
 * @param width Current width of the simulation
 * @param dividerLineWidth Width of the drop area
 */
export const getBallInitialXPos = (xPosValue: number | undefined, width: number, dividerLineWidth: number): number => {
	if (xPosValue) {
		if (xPosValue > 0 && xPosValue < width) {
			return xPosValue
		}
	}

	return Math.random() * width - dividerLineWidth - 50
}

/**
 * Returns the Initial Y value of the Ball that is defined by the user and if it is not it returns a random y in the lower half of the simulation position
 *
 * @param yPosValue The explicit Y position of the new ball if it es defined
 * @param height Current height of the simulation
 */
export const getBallInitialYPos = (yPosValue: number | undefined, height: number): number => {
	if (yPosValue) {
		if (yPosValue > 0 && yPosValue < height) {
			return yPosValue
		}
	}

	return height - (Math.random() * height) / 2 + 50
}

/**
 * Returns the start momentum of the ball on the X-Axis if it is not defined it returns a random value
 *
 * @param dx The explicit momentum on the X-Axis if defined
 */
export const getBallInitialXMomentum = (dx: number | undefined): number => {
	if (dx) {
		return dx
	}

	return (Math.random() - 0.5) * 4
}

/**
 * Returns the start momentum of the ball on the Y-Axis if it is not defined it returns a random value
 *
 * @param dy The explicit momentum on the Y-Axis if defined
 */
export const getBallInitialYMomentum = (dy: number | undefined): number => {
	if (dy) {
		return dy
	}

	return (Math.random() - 0.5) * 4
}
