import {IBall} from '../interfaces/Ball.ts'

export const getBallBackgroundColorForSimulation = (ball: IBall | undefined): string => {
	if (ball === undefined) {
		return '#eeeeee'
	}

	switch (ball.color) {
		case 'red':
			return '#ef4444'
		case 'blue':
			return '#3b82f6'
		case 'slate':
			return '#020617'
		default:
			return '#eeeeee'
	}
}
