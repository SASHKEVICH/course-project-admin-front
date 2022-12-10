import { genRequest } from "./genericRequest";

/* Return fields: message, userId, token*/
export const userLogin = async (email, password) => {
	const body = JSON.stringify({
		email: email,
		password: password,
	});
	const configInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: body,
	};
	const request = `/login`;
	return await genRequest(request, configInit);
};

/* Return fields: message, data, id */
export const createUser = async (login, email, password) => {
	const data = {
		login: login,
		email: email,
		password: password,
	};
	const configInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	const request = `/registration`;
	return await genRequest(request, configInit);
};
