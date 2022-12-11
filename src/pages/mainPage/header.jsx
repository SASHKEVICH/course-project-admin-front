import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/useAuth";
import "./style.css";

const Header = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await auth.signOut();
		navigate(`/login`, { replace: true });
	};

	return (
		<div className="header">
			<Typography 
				sx={{
					color: "#ffffff",
					fontFamily: "-apple-system",
					fontSize: 34,
					fontWeight: "bold",
				}}>
				Главная
			</Typography>
			<Button
				sx={{
					backgroundColor: "#fff",
					borderRadius: 2,
					height: "40px",
					width: "100px",
					color: "#000",
					"&:hover": {
						backgroundColor: "#ff3c38"
					}
				}}
				onClick={() => handleSignOut()}>
				Выйти
			</Button>
		</div>
	)
}

export default Header;
