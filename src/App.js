import React from "react";
import RequireAuth from "./auth/requireAuth";
import { ProvideAuth } from "./auth/useAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/mainPage/mainPage";
import LoginPage from "./pages/authentication/login/login";
import RegistrationPage from "./pages/authentication/registration/registration";

import AlbumsPage from "./pages/albumPage/albumsPage";
import BandsPage from "./pages/bandPage/bandPage";
import MembersPage from "./pages/memberPage/memberPage";
import SongsPage from "./pages/songPage/songPage";
import GenresPage from "./pages/genrePage/genrePage";

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
	{
		path: "/bands",
		name: "Bands",
		main: (
			<RequireAuth>
				<BandsPage />
			</RequireAuth>
		),
	},
	{
		path: "/members",
		name: "Members",
		main: (
			<RequireAuth>
				<MembersPage />
			</RequireAuth>
		),
	},
	{
		path: "/songs",
		name: "Songs",
		main: (
			<RequireAuth>
				<SongsPage />
			</RequireAuth>
		),
	},
	{
		path: "/genres",
		name: "Genres",
		main: (
			<RequireAuth>
				<GenresPage />
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
