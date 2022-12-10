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

	const signIn = async (login, password) => {
		const response = await userLogin(login, password);

		if (response.message === "success") {
			const userData = {
				userId: response.userId,
				token: response.token,
			};
			setUser(userData);
		}

		return response.message;
	};

	const signUp = async (login, email, password) => {
		const response = await createUser(login, email, password);

		if (response.message === "success") {
			const userData = {
				userId: response.userId,
				token: response.token,
			};

			setUser(userData);
		}

		return response.message;
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
