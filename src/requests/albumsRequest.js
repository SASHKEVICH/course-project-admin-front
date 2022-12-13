import { genRequest } from "./genericRequest";

const defaultRoute = "/albums";

export const getAllAlbums = async (token) => {
	const configInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	const response = await genRequest(defaultRoute, configInit);
	return response.body.info;
};
