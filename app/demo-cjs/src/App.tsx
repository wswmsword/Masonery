import React, { useState } from 'react';
import './App.css';
import { genIdChars, random } from './tools/number';
import { Masonry, withAutoColumn } from "masonry";
import GreyPinItem from './components/masonry-item';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type MasonryProps = React.ComponentProps<typeof Masonry>;

function App() {
	// eslint-disable-next-line
	const [itemsData, setData] = useState([...Array(18)].map((_, i) => ({ id: genIdChars(), h: random(69, 269) })));
	const MasonryWithAutoCol = withAutoColumn<MasonryProps>(Masonry, {
		gap: 18,
		itemW: 169,
	});

	const codeString = `<Masonry
	gapX={18}
	gapY={18}
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem} />`;
	const codeString2 = `
const MasonryWithAutoCol = withAutoColumn<MasonryProps>(Masonry, {
	gap: 18,
	itemW: 169,
});`;
	const codeString2_2 = `<MasonryWithAutoCol
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	gapX={18}
	gapY={18} />`;
	const codeString3 = `<Masonry
	width={569}
	itemWidth={169}
	colsNum={3}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	disableGapX
	gapY={18} />`;
	const codeString4 = `<Masonry
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	colsNum={3}
	gapX={18}
	gapY={18} />`;
	return (
		<div className="App">
			<header className="App-header">
				<h1>React Masonry</h1>
				{/*  */}
				<h2>铺满屏幕，项目之间间隔 18 像素</h2>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString}
				</SyntaxHighlighter>
				<Masonry
					itemWidth={169}
					itemsData={itemsData}
					ItemComp={GreyPinItem}
					gapX={18}
					gapY={18} />
				{/*  */}
				<h2>动态铺满屏幕，项目之间间隔 18 像素</h2>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString2}
				</SyntaxHighlighter>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString2_2}
				</SyntaxHighlighter>
				<MasonryWithAutoCol
					itemWidth={169}
					itemsData={itemsData}
					ItemComp={GreyPinItem}
					gapX={18}
					gapY={18} />
				{/*  */}
				<h2>指定 3 列，并在 569 像素的宽度间均匀分布</h2>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString3}
				</SyntaxHighlighter>
				<Masonry
					width={569}
					itemWidth={169}
					colsNum={3}
					itemsData={itemsData}
					ItemComp={GreyPinItem}
					disableGapX
					gapY={18} />
				{/*  */}
				<h2>指定 3 列，并在 569 像素的宽度间均匀分布</h2>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString4}
				</SyntaxHighlighter>
				<Masonry
					width={569}
					itemWidth={169}
					itemsData={itemsData}
					ItemComp={GreyPinItem}
					colsNum={3}
					gapX={18}
					gapY={18} />
			</header>
		</div>
	);
}

export default App;
