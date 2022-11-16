import React from "react";
import { useParams } from "react-router-dom";
function AlbumDetail() {
	const { id } = useParams();
	return <div>AlbumDetail of {id}</div>;
}

export default AlbumDetail;
