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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { RedTextField } from "../../../helpers/textFieldStyles";
import styles from "../login/styles"

const RegistrationPage = () => {
	const [login, setLogin] = useState("");
	const [nickname, setNickname] = useState("");
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

	const handleOnChange = (e) => {
		e.preventDefault();
		disableErrorIfEnabled();
	}

	const handleLoginOnChange = (e) => {
		handleOnChange(e);
		setLogin(e.target.value);
	};

	const handleNicknameOnChange = (e) => {
		handleOnChange(e);
		setNickname(e.target.value);
	};

	const handleEmailOnChange = (e) => {
		handleOnChange(e);
		setEmail(e.target.value);
	};

	const handlePasswordOnChange = (e) => {
		handleOnChange(e);
		setPassword(e.target.value);
	};

	const handlePasswordConfirmOnChange = (e) => {
		handleOnChange(e);
		setPasswordConfirm(e.target.value);
	};

	const handleRegistrationResponse = async () => {
		if (
			login === "" ||
			nickname === "" ||
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

		try {
			await auth.signUp(login, nickname, email, password);
		} catch (error) {
			console.error(error);
			enableError("Sign up failed.");
			return;
		}

		try {
			await auth.signIn(email, password);
		} catch {
			enableError("Sign in failed.");
			return;
		}

		navigate(`/main`, { replace: true });
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
		<Stack style={styles.container} spacing={3}>
			<div style={styles.loginBox}>
				<Stack
					direction="column"
					className="container1"
					spacing={3}
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
						label="ФИО"
						variant="outlined"
						className="StandardInput"
						fullWidth
						onChange={handleLoginOnChange}
					/>
					<RedTextField
						type="text"
						label="Никнэйм"
						variant="outlined"
						className="StandardInput"
						fullWidth
						onChange={handleNicknameOnChange}
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
