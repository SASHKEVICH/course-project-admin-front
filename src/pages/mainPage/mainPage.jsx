import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import Masonry from '@mui/lab/Masonry';

import { useAuth } from "../../auth/useAuth";
import Header from "./header";

import "./style.css"

const MainPage = () => {
	const auth = useAuth();
	return (
		<div className="container">
			<Header />
		</div>
	)
}

export default MainPage;
