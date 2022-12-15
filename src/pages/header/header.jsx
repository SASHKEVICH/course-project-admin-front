import { Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../auth/useAuth";
import styles from "./style"

const Header = ({ showBackButton, children }) => {
	const auth = useAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await auth.signOut();
		navigate(`/login`, { replace: true });
	};

	return (
		<div style={styles.header}>
			<div style={styles.leftItem}>
				<Link to="/main" style={{ textDecoration: "none" }}>
					<Typography
						display={showBackButton ? 'block' : 'none'}
						sx={{ 
							fontFamily: "-apple-system", 
							fontStyle: "italic",
							"&:hover": {
								color: "#ff3c38"
							}
						}} color={"#fff"}>
						{"< Назад"}
					</Typography>
				</Link>
				<Typography 
					sx={{
						color: "#ffffff",
						fontFamily: "-apple-system",
						fontSize: 34,
						fontWeight: "bold",
					}}>
					{children}
				</Typography>
			</div>
			<Button
				sx={{
					backgroundColor: "#fff",
					borderRadius: 2,
					height: "40px",
					width: "100px",
					color: "#000",
					"&:hover": {
						backgroundColor: "#ff3c38",
					},
				}}
				onClick={() => handleSignOut()}>
				Выйти
			</Button>
		</div>
	)
}

export default Header;
