import React, { useState } from 'react';
import './App.css';
import { genIdChars, random } from './tools/number';
import { Masonry, withAutoColumn } from "masonry";
import GreyPinItem from './components/masonry-item';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import withAutoColumn from './components/with-auto-column';

type MasonryProps = React.ComponentProps<typeof Masonry>;

function App() {
	// eslint-disable-next-line
	const [itemsData, setData] = useState([...Array(25)].map((_, i) => ({ id: genIdChars(), h: random(69, 269) })));

	const MasonryWithAutoCol = withAutoColumn<MasonryProps>(Masonry, {
		gap: 36,
		itemW: 180,
	});

	const codeString = `<Masonry
	gapX={18}
	gapY={18}
	colNum={3}
	itemWidth={180}
	itemsData={itemsData}
	ItemComp={GreyPinItem} />`;
	return (
		<div className="App">
			<header className="App-header">
				<h1>React Masonry</h1>
				<SyntaxHighlighter language="javascript" style={nightOwl} showLineNumbers>
					{codeString}
				</SyntaxHighlighter>
				<MasonryWithAutoCol
					gapX={36}
					gapY={36}
					itemWidth={210}
					itemsData={itemsData}
					ItemComp={GreyPinItem} />
			</header>
		</div>
	);
}

export default App;
