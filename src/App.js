import React from "react";
// import RequireAuth from "./authetication/requireAuth";
import { ProvideAuth } from "./authetication/useAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/mainPage/mainPage";
import LoginPage from "./authetication/login/login";

const routes = [
	{
		path: "/*",
		name: "Login",
		main: <LoginPage />,
	},
	{
		path: "/main",
		name: "Main",
		main: <MainPage />,
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
