import React from "react";
import { useParams } from "react-router-dom";
function Artist() {
	const { id } = useParams();

	return <div>Artist {id}</div>;
}

export default Artist;
