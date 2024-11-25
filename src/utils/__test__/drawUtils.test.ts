import {expect} from 'vitest'
import {drawBall, drawClaw, drawDividerLine} from '../drawUtils.ts'
import {IBall} from '../../interfaces/Ball.ts'

describe('test draw utils', () => {
	it('should draw a ball with default settings if no icon is provided', () => {
		// Mock CanvasRenderingContext2D
		const context = {
			beginPath: vi.fn(),
			arc: vi.fn(),
			fillStyle: '',
			fill: vi.fn(),
			closePath: vi.fn(),
			font: '',
			textAlign: '',
			textBaseline: '',
			fillText: vi.fn(),
		} as unknown as CanvasRenderingContext2D

		// Ball without icon
		const ball: IBall = {
			x: 50,
			y: 50,
			isInDropZone: false,
			dy: 0,
			dx: 0,
			radius: 20,
			text: 'Test',
			ballTextFontSize: 10,
			ballTextColor: 'blue',
			ballTextAlign: 'center',
			ballTextBaseline: 'middle',
		}

		drawBall(context, ball)

		expect(context.beginPath).toHaveBeenCalled()
		expect(context.arc).toHaveBeenCalledWith(50, 50, 20, 0, Math.PI * 2, false)
		expect(context.fillStyle).toBe('blue')
		expect(context.fill).toHaveBeenCalled()
		expect(context.closePath).toHaveBeenCalled()

		expect(context.font).toBe('10px Arial')
		expect(context.fillStyle).toBe('blue')
		expect(context.textAlign).toBe('center')
		expect(context.textBaseline).toBe('middle')
		expect(context.fillText).toHaveBeenCalledWith('Test', 50, 50)
	})

	it('should draw the claw with the correct settings', () => {
		// Mock CanvasRenderingContext2D
		const context = {
			beginPath: vi.fn(),
			moveTo: vi.fn(),
			lineTo: vi.fn(),
			stroke: vi.fn(),
			closePath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
		} as unknown as CanvasRenderingContext2D

		// Mock claw parameters
		const clawWidth = 10
		const clawColor = 'blue'
		const clawBoltColor = 'yellow'

		const positions = {
			innerLineStart: {x: 50, y: 50},
			rightInnerLineMiddle1: {x: 60, y: 60},
			rightInnerLineMiddle2: {x: 70, y: 70},
			rightInnerLineEnd: {x: 80, y: 80},
			outerLineStart: {x: 50, y: 50},
			rightOuterLineMiddle1: {x: 60, y: 60},
			rightOuterLineMiddle2: {x: 70, y: 70},
			rightOuterLineEnd: {x: 80, y: 80},
			leftInnerLineMiddle1: {x: 40, y: 60},
			leftInnerLineMiddle2: {x: 30, y: 70},
			leftInnerLineEnd: {x: 20, y: 80},
			leftOuterLineMiddle1: {x: 40, y: 60},
			leftOuterLineMiddle2: {x: 30, y: 70},
			leftOuterLineEnd: {x: 20, y: 80},
		}

		drawClaw(
			clawWidth,
			context,
			positions.innerLineStart,
			positions.rightInnerLineMiddle1,
			positions.rightInnerLineMiddle2,
			positions.rightInnerLineEnd,
			positions.outerLineStart,
			positions.rightOuterLineMiddle1,
			positions.rightOuterLineMiddle2,
			positions.rightOuterLineEnd,
			positions.leftInnerLineMiddle1,
			positions.leftInnerLineMiddle2,
			positions.leftInnerLineEnd,
			positions.leftOuterLineMiddle1,
			positions.leftOuterLineMiddle2,
			positions.leftOuterLineEnd,
			clawColor,
			clawBoltColor,
		)

		// Assertions for drawing paths
		expect(context.beginPath).toHaveBeenCalledTimes(6) // Each section of the claw + the bolt
		expect(context.stroke).toHaveBeenCalledTimes(5) // Lines drawn 5 times
		expect(context.arc).toHaveBeenCalledOnce() // The claw bolt
		expect(context.fill).toHaveBeenCalledOnce() // The claw bolt fill

		// Check the first path (inner line to top)
		expect(context.moveTo).toHaveBeenCalledWith(50, 50)
		expect(context.lineTo).toHaveBeenCalledWith(50, 0)

		// Check the last arc for the bolt
		expect(context.arc).toHaveBeenCalledWith(50, 50 + clawWidth / 1.5, clawWidth / 2, 0, Math.PI * 2, false)
		expect(context.fill).toHaveBeenCalled()
	})

	it('should draw the divider lines and fill the rectangle with the correct settings', () => {
		// Mock CanvasRenderingContext2D
		const context = {
			beginPath: vi.fn(),
			moveTo: vi.fn(),
			lineTo: vi.fn(),
			stroke: vi.fn(),
			closePath: vi.fn(),
			fillStyle: '',
			fillRect: vi.fn(),
			strokeStyle: '',
			lineWidth: 0,
		} as unknown as CanvasRenderingContext2D

		// Mock divider line parameters
		const dividerLineWidth = 100
		const dividerLineHeight = 10
		const dividerLineFillColor = 'red'
		const dividerLineBorderColor = 'black'

		const dividerLineLeftStart = {x: 50, y: 50}
		const dividerLineLeftEnd = {x: 150, y: 50}
		const dividerLineRightStart = {x: 50, y: 60}
		const dividerLineRightEnd = {x: 150, y: 60}

		drawDividerLine(
			context,
			dividerLineWidth,
			dividerLineHeight,
			dividerLineLeftStart,
			dividerLineLeftEnd,
			dividerLineRightStart,
			dividerLineRightEnd,
			dividerLineFillColor,
			dividerLineBorderColor,
		)

		// Assertions for line drawing
		expect(context.beginPath).toHaveBeenCalledTimes(3)
		expect(context.moveTo).toHaveBeenCalledWith(50, 50) // First line start
		expect(context.lineTo).toHaveBeenCalledWith(150, 50) // First line end
		expect(context.strokeStyle).toBe(dividerLineBorderColor)
		expect(context.lineWidth).toBe(1)
		expect(context.stroke).toHaveBeenCalled()

		// Assertions for rectangle fill
		expect(context.fillStyle).toBe(dividerLineFillColor)
		expect(context.fillRect).toHaveBeenCalledWith(50, 50, dividerLineWidth, dividerLineHeight)
	})
})
