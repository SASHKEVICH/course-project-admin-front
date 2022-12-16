import { genRequest } from "./genericRequest";

const defaultRoute = "/genres";

export const getAllGenres = async (token) => {
	const configInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	const response = await genRequest(defaultRoute, configInit);
	return response.body.genres;
};

export const createGenre = async (name, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			name: name,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const updateGenre = async (genre, token) => {
	const configInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			genreId: genre.genreId,
			name: genre.name,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const deleteGenres = async (ids, token) => {
	const configInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			genreIds: ids,
		}),
	};
	await genRequest(defaultRoute, configInit);
};
