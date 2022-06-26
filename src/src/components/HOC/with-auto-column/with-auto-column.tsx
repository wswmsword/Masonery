import React from "react";
import { useEffect, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";

interface hocProps {
	gap: number;
	itemW: number;
}

interface ExtraInfo {
	colsNum: number;
}

/**根据屏幕宽度、每个项目的左右间隔、项目宽度，计算一行能放的项目数量 */
export default function withAutoColumn<P>(WrappedComponent: React.ComponentType<P>, { gap, itemW }: hocProps) {
	return function WithAutoColumn(props: Omit<P, keyof ExtraInfo>) {
		const [colsNum, setColNum] = useState<number | null>(null);
		const size = useWindowSize();

		useEffect(() => {
			const windowW = size.width;
			if (windowW == null) { return; }
			const colsNum = calColsNum(itemW, itemW, gap, windowW);
			setColNum(colsNum);
		}, [size]);

		if (colsNum) {
			return <WrappedComponent
				{...(props) as P}
				colsNum={colsNum}
			/>;
		} else {
			return <>Now Loading...</>;
		}
	};
}

function calColsNum(accWidth: number, itemWidth: number, gap: number, windowW: number): number {
	if (accWidth > windowW) { return 0; }
	return 1 + calColsNum(accWidth + gap + itemWidth, itemWidth, gap, windowW);
}