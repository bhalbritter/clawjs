import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {ClawMachine} from '../ClawMachine.tsx'
import React from 'react'

describe('Canvas Component', () => {
	it('should render the canvas with the correct dimensions and styles', () => {
		const {container} = render(
			<ClawMachine
				width={800}
				height={600}
				ballData={[]}
				alreadyDroppedBalls={[]}
				addToDroppedBalls={() => console.log()}
			/>,
		)

		const canvas = container.querySelector('canvas')
		expect(canvas).toBeInTheDocument()
		expect(canvas).toHaveAttribute('width', '800')
		expect(canvas).toHaveAttribute('height', '600')
		expect(canvas).toHaveStyle('border: 1px solid black')
		expect(canvas).toHaveStyle('width: 100%')
	})
})
