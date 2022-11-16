import React from "react";
import { useParams } from "react-router-dom";
function PlayListDetail() {
	const { id } = useParams();

	return <div>PlayListDetail {id}</div>;
}

export default PlayListDetail;
