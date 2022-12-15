import React from "react";
import RequireAuth from "./auth/requireAuth";
import { ProvideAuth } from "./auth/useAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/mainPage/mainPage";
import LoginPage from "./pages/authentication/login/login";
import RegistrationPage from "./pages/authentication/registration/registration";

import AlbumsPage from "./pages/albumPage/albumsPage";

import "./App.css";

const routes = [
	{
		path: "/*",
		name: "Login",
		main: <LoginPage />,
	},
	{
		path: "/registration",
		name: "Registration",
		main: <RegistrationPage />,
	},
	{
		path: "/main",
		name: "Main",
		main: (
			// <RequireAuth>
			// 	<MainPage />
			// </RequireAuth>
			<MainPage />
		),
	},
	{
		path: "/albums",
		name: "Albums",
		main: (
			<RequireAuth>
				<AlbumsPage />
			</RequireAuth>
		),
	},
];

function App() {
	return (
		<ProvideAuth>
			<Router>
				<div className="main-div">
					{/* Body */}
					<div className="body-element">
						<Routes>
							{routes.map((route, index) => (
								<Route key={index} path={route.path} element={route.main} />
							))}
						</Routes>
					</div>
				</div>
			</Router>
		</ProvideAuth>
	);
}

export default App;
