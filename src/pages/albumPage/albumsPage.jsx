import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Header from "../header/header";
import { getAllAlbums } from "../../requests/albumsRequest";
import { useAuth } from "../../auth/useAuth";

import "./style.css";

const AlbumsPage = () => {
	const [albums, setAlbums] = useState([]);

	const auth = useAuth();
	const token = auth.user.token;

	useEffect(() => {
		getAlbums()
		// setAlbums(newAlbums);
	}, []);

	const getAlbums = async () => {
		try {
			console.log(token)
			const newAlbums = await getAllAlbums(token);
			console.log(newAlbums);
		} catch (error) {
			console.log(error)
		}
	};

	return (
		<div className="container">
			<Header>Альбомы</Header>
			<Box width="80vw" height="100vh">

			</Box>
		</div>
	);
};

export default AlbumsPage;