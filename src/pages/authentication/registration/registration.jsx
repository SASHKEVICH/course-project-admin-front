import React, { useState } from "react";
import {
	TextField,
	Typography,
	Stack,
	Button,
	IconButton,
	InputAdornment,
} from "@mui/material";
import { useAuth } from "../../../auth/useAuth";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { RedTextField } from "../../../helpers/textFieldStyles";

const RegistrationPage = () => {
	const [login, setLogin] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [errorText, setErrorText] = useState("");
	const [error, setError] = useState(false);

	const auth = useAuth();
	const navigate = useNavigate();

	const disableErrorIfEnabled = () => {
		if (error) {
			setError(false);
			setErrorText("");
		}
	};

	const enableError = (text) => {
		setError(true);
		setErrorText(text);
	};

	const handleLoginOnChange = (e) => {
		e.preventDefault();
		disableErrorIfEnabled();
		setLogin(e.target.value);
	};

	const handleEmailOnChange = (e) => {
		e.preventDefault();
		disableErrorIfEnabled();
		setEmail(e.target.value);
	};

	const handlePasswordOnChange = (e) => {
		e.preventDefault();
		disableErrorIfEnabled();
		setPassword(e.target.value);
	};

	const handlePasswordConfirmOnChange = (e) => {
		e.preventDefault();
		disableErrorIfEnabled();
		setPasswordConfirm(e.target.value);
	};

	const handleRegistrationResponse = async () => {
		if (
			login === "" ||
			email === "" ||
			password === "" ||
			passwordConfirm === ""
		) {
			enableError("One or more fields are empty.");
			return;
		}

		const emailRegular =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegular.test(email)) {
			enableError("Email is incorrect.");
			return;
		}

		if (password !== passwordConfirm) {
			enableError("Confirmation password is incorrect.");
			return;
		}

		const responseSignUp = await auth.signUp(login, email, password);

		if (responseSignUp === "failure") {
			enableError("Sign up failed.");
			return;
		}

		const responseSignIn = await auth.signIn(login, password);

		if (responseSignIn === "failure") {
			enableError("Sign in failed.");
			return;
		}

		navigate(`/tasks`, { replace: true });
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	function PasswordIcon() {
		return (
			<InputAdornment position="end">
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
	}

	return (
		<Stack className="container" spacing={3}>
			<div className="login-box">
				<Stack
					direction="column"
					className="container1"
					spacing={2}
					alignItems="center"
				>
					<Typography 
						sx={{
							fontFamily: "-apple-system",
							fontSize: 24,
							fontWeight: 600,
							color: "#fff"
						}}>
						Регистрация в EHM
					</Typography>
					<RedTextField
						type="text"
						label="Логин"
						variant="outlined"
						className="StandardInput"
						fullWidth
						onChange={handleLoginOnChange}
					/>
					<RedTextField
						type="email"
						label="Email"
						className="StandardInput"
						variant="outlined"
						fullWidth
						onChange={handleEmailOnChange}
					/>
					<RedTextField
						label="Пароль"
						type={showPassword ? "text" : "password"}
						className="StandardInput"
						variant="outlined"
						fullWidth
						onChange={handlePasswordOnChange}
						InputProps={{
							endAdornment: PasswordIcon(),
						}}
					/>
					<RedTextField
						label="Повторите пароль"
						type={showPassword ? "text" : "password"}
						className="StandardInput"
						variant="outlined"
						fullWidth
						helperText={errorText}
						error={error}
						onChange={handlePasswordConfirmOnChange}
					/>
				</Stack>
			</div>
			<div className="button">
				<Button
					className="button_Registration"
					variant="text"
					sx={{
						backgroundColor: "#fff",
						borderRadius: 2,
						width: "250px",
						"&:hover": {
							backgroundColor: "#ff3c38"
						}
					}}
					onClick={handleRegistrationResponse}
				>
					<Typography color={"#000"} fontSize={15}>Зарегистрироваться</Typography>
				</Button>
			</div>
			<div className="links">
				<Link to="/" style={{ textDecoration: "none" }}>
					<Typography 
						sx={{ 
							fontFamily: "-apple-system",
							fontStyle: "italic",
							color: "#fff",
							"&:hover": {color: "#ff3c38"}
						}}>
						Уже есть аккаунт? Нажмите здесь, чтобы войти.
					</Typography>
				</Link>
			</div>
		</Stack>
	);
};

export default RegistrationPage;
