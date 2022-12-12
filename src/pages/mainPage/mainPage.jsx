import React from "react";
import { Typography, Box, Card, CardContent, CardActionArea } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/useAuth";
import Header from "./header";

import "./style.css"

const itemData = [
	{
		title: "Альбомы",
		path: "/albums",
	},
	{
		title: "Группы",
		path: "/bands"
	},
	{
		title: "Участники",
		path: "/members"
	},
	{
		title: "Песни",
		path: "/songs"
	},
	{
		title: "Жанры",
		path: "/genres"
	},
]

const MainPage = () => {
	const navigate = useNavigate();

	const handleCardClick = (path) => {
		navigate(path, { replace: true })
	};

	return (
		<div className="container">
			<Header />
			<Box sx={{ width: "80vw", height: "100vh" }}>
				<Masonry columns={3} spacing={5} sx={{width: "100%", margin: "1% auto 0 auto"}}>
        {itemData.map((item, index) => (
					<Card 
						sx={{ 
							height: 125, 
							borderRadius: 3,
							backgroundColor: "#CF1E1B"
						}} 
						key={index}>
						<CardActionArea 
							sx={{
								height: "100%",
								"& .MuiCardActionArea-focusHighlight": {
									color: "#1D1D1D"
								}
							}} 
							onClick={() => handleCardClick(item.path)}
						>
							<CardContent
								sx={{ 
									height: "75%",
									display: "flex",
									alignItems: "flex-end"
								}} 
							>
								<Typography 
									sx={{
										fontFamily: "-apple-system",
										fontSize: 22,
										marginLeft: "2%",
										color: "#fff"
									}}
								>
									{item.title}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
        ))}
     	 </Masonry>
			</Box>
		</div>
	)
}

export default MainPage;
