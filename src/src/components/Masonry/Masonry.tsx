import React from "react";
import styles from "./Masonry.module.css";

export interface MasonryProps {
	label: string;
}

const Masonry = (props: MasonryProps) => {
	return <div className={styles.purple}>{props.label}</div>;
};

export default Masonry;