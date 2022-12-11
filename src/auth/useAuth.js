import React, { createContext, useContext, useState } from "react";
import { createUser, userLogin } from "../requests/userRequests";

const authContext = createContext(null);

export function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth() {
	const [user, setUser] = useState(null);

	const signIn = async (email, password) => {
		const response = await userLogin(email, password);
		if (response.status >= 400 && response.status < 500) {
			throw Error(response.status);
		}

		const userData = {
			userId: response.userId,
			token: response.token,
		};
		setUser(userData);
	};

	const signUp = async (login, nickname, email, password) => {
		const response = await createUser(login, nickname, email, password);
		if (response.status >= 400 && response.status < 500) {
			throw Error(response.status);
		}

		const userData = {
			userId: response.userId,
			token: response.token,
		};
		setUser(userData);
	};

	const signOut = () => {
		setUser(null);
	};

	return {
		user,
		signIn,
		signUp,
		signOut,
	};
}
