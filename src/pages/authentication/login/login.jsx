import React, { useState } from "react";
import {
	Typography,
	Stack,
	Button,
	IconButton,
	InputAdornment,
} from "@mui/material";
import { useAuth } from "../../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material/";
import { Link } from "react-router-dom";

import { RedTextField } from "../../../helpers/textFieldStyles";
import styles from "./styles"

const LoginPage = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const handleLoginOnChange = (event) => {
		event.preventDefault();
		if (error) {
			setError(false);
			setErrorText("");
		}

		const login = event.target.value;
		setLogin(login);
	};

	const handlePasswordOnChange = (event) => {
		event.preventDefault();
		if (error) {
			setError(false);
			setErrorText("");
		}

		const password = event.target.value;
		setPassword(password);
	};

	const handleSignInResponse = async () => {
		if (login === "" || password === "") {
			setError(true);
			setErrorText("One or more fields are empty.");
			return;
		}

		const response = await auth.signIn(login, password);
		if (response === "failure") {
			setError(true);
			setErrorText("Incorrect login or password.");
			return;
		}

		navigate(`/main`, { replace: true });
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const showPasswordIcon = () => {
		return (
			<InputAdornment
				position="end">
				<IconButton
					sx={{
						color: "#fff"
					}}
					aria-label="toggle password visibility"
					onClick={handleClickShowPassword}
				>
					{showPassword ? <Visibility /> : <VisibilityOff />}
				</IconButton>
			</InputAdornment>
		);
	};

	return (
		<Stack style={styles.container} spacing={3}>
			<div style={styles.loginBox}>
				<Stack
					direction="column"
					className="container1"
					spacing={3}
					alignItems="center"
				>
					<Typography fontFamily={"-apple-system"} fontSize={24} fontWeight={600} color={"#fff"}>
						Вход в аккаунт EHM
					</Typography>
					<RedTextField 
						id="standard-basic"
						label="Email"
						variant="outlined"
						fullWidth
						onChange={(event) => handleLoginOnChange(event)}
					/>
					<RedTextField
						id="standard-basic-1"
						label="Пароль"
						variant="outlined"
						fullWidth
						type={showPassword ? "text" : "password"}
						onChange={(event) => handlePasswordOnChange(event)}
						helperText={errorText}
						error={error}
						InputProps={{
							input: {
								color: "#ff3c38"
							},
							endAdornment: showPasswordIcon(),
						}}
					/>
				</Stack>
			</div>
			<div className="login-button">
				<Button
					sx={{
						backgroundColor: "#fff",
						borderRadius: 2,
						width: "100px",
						"&:hover": {
							backgroundColor: "#ff3c38"
						}
					}}
					className="log_but"
					variant="text"
					onClick={() => handleSignInResponse()}
				>
					<Typography fontSize={15} color={"#000"}>Войти</Typography>
				</Button>
			</div>
			<div className="links">
				<Link to="/registration" style={{ textDecoration: "none" }}>
					<Typography 
						sx={{ 
							fontFamily: "-apple-system", 
							fontStyle: "italic",
							"&:hover": {
								color: "#ff3c38"
							}
						}} color={"#fff"}>
						Зарегистрироваться
					</Typography>
				</Link>
			</div>
		</Stack>
	);
};

export default LoginPage;
