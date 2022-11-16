import React from "react";
import { useParams } from "react-router-dom";
function Search() {
	const { keyword } = useParams();

	return <div>Search {keyword}</div>;
}

export default Search;
