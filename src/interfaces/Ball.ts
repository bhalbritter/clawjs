export interface IBall {
	x: number
	y: number
	radius: number
	dx: number
	dy: number
	isInDropZone: boolean
	text: string
	iconPath?: string
	imageHeight?: number
	imageWidth?: number
	ballColor?: string
	ballTextFontSize?: number
	ballTextColor?: string
	ballTextAlign?: 'center' | 'left' | 'right'
	ballTextBaseline?: 'middle' | 'top' | 'bottom'
}
