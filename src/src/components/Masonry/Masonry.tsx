import React from "react";

export interface MasonryProps {
	label: string;
}

const Masonry = (props: MasonryProps) => {
	return <div>{props.label}</div>;
};

export default Masonry;