import {IPosition} from './Position.ts'

export interface ICollisionPoints {
	innerLineStart: IPosition
	rightInnerLineMiddle1: IPosition
	rightInnerLineMiddle2: IPosition
	rightInnerLineEnd: IPosition
	leftInnerLineMiddle1: IPosition
	leftInnerLineMiddle2: IPosition
	leftInnerLineEnd: IPosition
	outerLineStart: IPosition
	rightOuterLineMiddle1: IPosition
	rightOuterLineMiddle2: IPosition
	rightOuterLineEnd: IPosition
	leftOuterLineMiddle1: IPosition
	leftOuterLineMiddle2: IPosition
	leftOuterLineEnd: IPosition
	dividerLineLeftStart: IPosition
	dividerLineLeftEnd: IPosition
	dividerLineRightStart: IPosition
	dividerLineRightEnd: IPosition
}
