import React, { useState, useRef, useEffect, Fragment, useCallback } from "react";
import styles from "./Masonry.module.css";

interface ItemCompProps {
	info: itemInfo; // 项目数据
	colId: number; // 项目所处的纵列
	selected: boolean; // 项目是否被选中
	selectedItem: number | null; // 被选中的项目 id
	setItemOffsetYs: (ys: Array<readonly [number, number]>) => void; // 设置项目的纵向偏移
	itemsDividedByCols: itemInfo[][]; // 按纵列分的项目数据
	itemInfos: itemInfo[]; // 所有项目数据
	deselect: () => void; // 取消选中函数
	select: (id: number) => void; // 选中函数
	placeH: number; // 详情区域的高度
	gapY: number; // 纵向的项目间的间隔
	gapX: number // 横向的项目间的间隔
	setPlaceTop: (t: number) => void; // 设置详情区域距离顶端的距离
	setPlaceData: any; // 设置详情区域的数据
	originH: number; // 原始容器的高度
	setH: (h: number) => void; // 设置容器的高度
	readyToCalc: () => void; // 设置项目加载完成，可以计算位置了
}

interface PlaceCompProps {
	selectedItem: number | null; // 被选中的项目 id
	setItemOffsetYs: (itemsMapAry: Array<readonly [number, number]>) => void; // 设置项目的纵向偏移
	itemsDividedByCols: itemInfo[][]; // 按纵列分的项目数据
	itemInfosRef: React.MutableRefObject<itemInfo[]>; // 所有项目数据
	deselect: () => void; // 取消选中函数
	select: (id: number) => void; // 选中函数
	placeH: number; // 详情区域的高度
	gapY: number; // 纵向的项目间的间隔
	gapX: number; // 横向的项目间的间隔
	setPlaceTop: (t: number) => void; // 设置详情区域距离顶端的距离
	setPlaceData: any; // 设置详情区域的数据
	originH: number; // 原始容器的高度
	setH: (h: number) => void; // 设置容器的高度
	context: unknown;
}

interface MasonryProps {
	width?: number,
	itemWidth: number,
	colsNum?: number,
	gapX?: number,
	gapY?: number,
	placeHeight?: number,
	itemsData: Record<string, unknown>[],
	ItemComp: React.ComponentType<ItemCompProps>,
	PlaceComp?: React.ComponentType<PlaceCompProps>,
	disableGapX?: boolean,
	disableWrap?: boolean,
}

interface itemInfo {
	id: number,
	top: number,
	left: number,
	height: number,
	colId: number,
	offsetY: number,
	data: Record<string, unknown>,
}

/**
 * 砖块布局组件
 * 
 * 设置宽度，子项目将均匀布局在宽度中；设置左右间隔，子项目将按间隔
 * 布局，宽度即子项目间隔后的宽度。
 */
function Masonry({ disableGapX, width, disableWrap, itemWidth, gapX, gapY, colsNum, placeHeight, ItemComp, itemsData = [], PlaceComp }: MasonryProps) {
	const _disableGapX = disableGapX ?? false,
		_width = width ?? window.document.getElementsByTagName('html')[0].clientWidth,
		_disableWrap = disableWrap ?? false,
		_itemWidth = itemWidth,
		_gapX = _disableGapX ? calcGapX(_width, _itemWidth) : (gapX ?? 0),
		_gapY = gapY ?? 0,
		_colsNum = colsNum ?? (_disableGapX ? (Math.floor(_width / _itemWidth)) : calColsNum(_itemWidth, _itemWidth, _gapX, _width)),
		_placeHeight = placeHeight ?? 521;
	// 容器宽度
	const [w, setW] = useState(_width);
	// 容器高度
	const [h, setH] = useState(0);
	// 容器的初始高度
	const [h2, setH2] = useState(0);
	// 项目横向间隔
	const [g, setG] = useState(_gapX);
	// top, left, ItemComp，项目信息
	const [itemInfos, setItemInfos] = useState<itemInfo[]>([]);
	const itemInfosRef = useRef<itemInfo[]>(itemInfos);
	// 每一纵列由上至下的项目信息
	const [infosDividedByCols, setInfosDividedByCols] = useState<itemInfo[][]>([]);
	// 选中的项目 id
	const [selectedItem, setSelectedItem] = useState<number | null>(null);
	// const [placeholderTop, setPlaceholderTop] = useState(0);
	// 详情区域距离顶部的距离
	const [placeT, setPlaceTop] = useState(0);
	const [placeData, setPlaceData] = useState({ init: "bird" });
	// 加载完成的项目数量
	const [loadedItems, setLoaded] = useState<Array<boolean | undefined>>([]);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const [hasMoveAnime, setHasMoveAnime] = useState(false);

	useEffect(() => {
		let width = null;
		let gapX = null;
		if (_disableWrap) {
			width = _width;
		} else {
			width = _gapX * (_colsNum - 1) + _itemWidth * _colsNum;
		}
		setW(width);
		if (_disableGapX) {
			gapX = calcGapX(width, _itemWidth);
		} else {
			gapX = _gapX;
		}
		setG(gapX);
	}, [_width, _disableWrap, _itemWidth, _disableGapX, _gapX, _colsNum]);

	useEffect(() => {
		// 子项目数目
		const itemsLen = itemsData.length;
		setItemInfos(v => {
			const prevLen = v.length;
			const concatedItems = v.concat([...Array(itemsLen - prevLen)].map((_, i) => ({
				id: 0,
				top: 0, // 项目顶部与容器顶部的距离
				left: 0, // 项目的左边与容器左边的距离
				height: 0, // 项目高度
				colId: 0, // 项目所在纵列
				offsetY: 0, // 项目偏移距离
				data: itemsData[prevLen + i],
			})));
			return concatedItems;
		});

		setHasMoveAnime(false);
		setTimeout(() => {
			setHasMoveAnime(true);
		}, 69);
	}, [itemsData]);

	useEffect(() => {
		// 加载完成的项目数量
		const loadedItemsLen = loadedItems.filter(b => b).length;
		// 所有项目数量
		const totalItemsLen = itemsData.length;
		if (loadedItemsLen !== totalItemsLen) { return; }
		// 子项目数目
		const itemsLen = itemsData.length;
		// 项目的高度
		const wrapperEl = wrapperRef.current;
		if (wrapperEl == null) { return; }
		const itemHs = Array.prototype.map.call<NodeListOf<ChildNode>, any, number[]>(wrapperEl.childNodes, (node: HTMLDivElement) => node.clientHeight);
		// 列的左边距离
		const leftSideColLeft = _disableWrap ? disableGapX ? 0 : ((_width - _itemWidth * _colsNum - g * (_colsNum - 1)) / 2) : 0;
		const colLs = [leftSideColLeft];
		for (let i = 1; i < _colsNum; ++i) {
			colLs.push(colLs[i - 1] + _itemWidth + g);
		}
		// 项目的左边距离
		const itemLs: number[] = [];
		// 容器高度
		let wrapperH = 0;
		// 项目的上边距离
		const itemTs: number[] = [];
		// 每一纵列底部项目的 id
		const colBottomIds = [];
		// 项目的所在列 id
		const itemCs: number[] = [];
		// 第一横排的容器高度、项目左边距离、项目顶部距离；纵列最下面项目的 id
		for (let i = 0; i < _colsNum; ++i) {
			wrapperH = Math.max(wrapperH, itemHs[i]);
			itemLs.push(colLs[i]);
			itemTs.push(0);
			itemCs.push(i);
			colBottomIds.push(i);
		}
		// 第二行开始到最后一个项目的容器高度、项目左边距离、项目顶部距离；纵列最下面项目的 id
		for (let i = _colsNum; i < itemsLen; ++i) {
			// 当前最短的纵列的列 id 与这一列最底部的项目 id
			const { minColId, minItemId } = getMinHeight(_colsNum, colBottomIds, itemTs, itemHs);
			const currentTop = itemTs[minItemId] + itemHs[minItemId] + _gapY;
			wrapperH = Math.max(currentTop + itemHs[i], wrapperH);
			itemLs.push(colLs[minColId]);
			itemTs.push(currentTop);
			itemCs.push(minColId);
			colBottomIds[minColId] = i;
		}
		setH(wrapperH);
		setH2(wrapperH);
		// 生成项目信息
		const newItemInfos = [...Array(itemsLen)].map((_, i) => ({
			id: i,
			top: itemTs[i],
			left: itemLs[i],
			height: itemHs[i],
			colId: itemCs[i],
			offsetY: 0,
			data: itemsData[i],
		}));
		setItemInfos(newItemInfos);
		itemInfosRef.current = newItemInfos;
		// 每一纵列的项目信息
		const infosDividedByCols: itemInfo[][] = newItemInfos.reduce((acc, cur) => {
			const curCol = cur.colId;
			acc[curCol] = acc[curCol].concat(cur);
			return acc;
		}, [...Array(_colsNum)].fill([]));
		setInfosDividedByCols(infosDividedByCols);
	}, [wrapperRef, _itemWidth, _colsNum, g, _gapY, itemsData, loadedItems, _disableWrap, w]);

	/**
	 * 指定 item 设置偏移
	 * @param {Array} itemsMapAry 
	 * 形如
	 * [[id1, offset1],
	 * [id2, offset2],
	 * [id3, offset3]]
	 */
	const setItemOffsetYs = useCallback((itemsMapAry: Array<readonly [number, number]>) => {
		const offsetMap = new Map<number, number>(itemsMapAry);
		setItemInfos((itemInfos: itemInfo[]) => {
			const res = itemInfos.map((item: itemInfo) => {
				const offsetY = offsetMap.get(item.id) == null ? item.offsetY : offsetMap.get(item.id) as number;
				return {
					...item,
					offsetY,
				};
			});
			itemInfosRef.current = res;
			return res;
		});
	}, []);

	const deselect = useCallback(() => setSelectedItem(null), []);
	const select = useCallback((id: number) => setSelectedItem(id), []);

	const setLoadedItem = useCallback((i: number) => {
		return () => {
			setLoaded(v => {
				const newV = [...v];
				newV[i] = true;
				return newV;
			});
		};
	}, []);

	return (<>
		<div
			ref={wrapperRef}
			className={styles.wrapper}
			style={{
				width: `${w}px`,
				height: `${h}px`,
			}}>
			{itemInfos.map((item, i) => <Fragment key={i}>
				<div
					className={`${styles.item} ${item.id === selectedItem ? styles.selected : ''} ${hasMoveAnime ? styles.transition_top : ''}`}
					style={{
						position: "absolute",
						transform: `translateY(${item.offsetY}px)`,
						left: `${item.left}px`,
						top: `${item.top}px`,
						width: `${_itemWidth}px`,
					}}>
					{ItemComp && <ItemComp
						{...item.data}
						info={item} // 项目数据
						colId={item.colId} // 项目所处的纵列
						selected={selectedItem === item.id} // 项目是否被选中
						selectedItem={selectedItem} // 被选中的项目 id
						setItemOffsetYs={setItemOffsetYs} // 设置项目的纵向偏移
						itemsDividedByCols={infosDividedByCols} // 按纵列分的项目数据
						itemInfos={itemInfos} // 所有项目数据
						deselect={deselect} // 取消选中函数
						select={select} // 选中函数
						placeH={_placeHeight} // 详情区域的高度
						gapY={_gapY} // 纵向的项目间的间隔
						gapX={_gapX} // 横向的项目间的间隔
						setPlaceTop={setPlaceTop} // 设置详情区域距离顶端的距离
						setPlaceData={setPlaceData} // 设置详情区域的数据
						originH={h2} // 原始容器的高度
						setH={setH} // 设置容器的高度
						readyToCalc={setLoadedItem(i)} // 设置项目加载完成，可以计算位置了
					/>}
				</div>
			</Fragment>)}
			{PlaceComp && <>
				<div
					className={styles.placeholder}
					style={{
						top: `${placeT}px`,
						height: `${_placeHeight}px`,
					}}>
					<PlaceComp
						selectedItem={selectedItem} // 被选中的项目 id
						setItemOffsetYs={setItemOffsetYs} // 设置项目的纵向偏移
						itemsDividedByCols={infosDividedByCols} // 按纵列分的项目数据
						itemInfosRef={itemInfosRef} // 所有项目数据
						deselect={deselect} // 取消选中函数
						select={select} // 选中函数
						placeH={_placeHeight} // 详情区域的高度
						gapY={_gapY} // 纵向的项目间的间隔
						gapX={_gapX} // 横向的项目间的间隔
						setPlaceTop={setPlaceTop} // 设置详情区域距离顶端的距离
						setPlaceData={setPlaceData} // 设置详情区域的数据
						originH={h2} // 原始容器的高度
						setH={setH} // 设置容器的高度
						context={[placeData]}
					/>
				</div>
			</>}
		</div>
	</>);
}

export default Masonry;


function getMinHeight(colsNum: number, colBottomIds: number[], itemTops: number[], itemHeights: number[]) {
	let minTop = itemTops[colBottomIds[0]] + itemHeights[colBottomIds[0]],
		minItemId = colBottomIds[0],
		minColId = 0;
	for (let i = 1; i < colsNum; ++i) {
		const itemId = colBottomIds[i];
		const curTop = itemTops[itemId] + itemHeights[itemId];
		if (curTop < minTop) {
			minTop = curTop;
			minItemId = itemId;
			minColId = i;
		}
	}
	return { minItemId, minColId };
}

function calColsNum(accWidth: number, itemWidth: number, gap: number, windowW: number): number {
	if (accWidth > windowW) { return 0; }
	return 1 + calColsNum(accWidth + gap + itemWidth, itemWidth, gap, windowW);
}

function calcGapX(width: number, itemWidth: number): number {
	const maxCols = Math.floor(width / itemWidth);
	const colsWidth = maxCols * itemWidth;
	const totalGapX = width - colsWidth;
	const gapX = totalGapX / (maxCols - 1);
	return gapX;
}