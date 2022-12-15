import { genRequest } from "./genericRequest";

const defaultRoute = "/bands";

export const getAllBands = async (token) => {
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

export const createBand = async (title, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			title: title,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const updateBand = async (band, token) => {
	const configInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			bandId: band.band_id,
			title: band.title,
			photoPath: band.photo_path,
			founded: band.founded,
			ended: band.ended,
			history: band.history,
			originCity: band.origin_city,
			country: band.country,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const postGenreToBand = async (bandId, genreId, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			bandId: bandId,
			genreId: genreId,
		}),
	};
	console.log(configInit.body);
	const route = defaultRoute + "/add-genre";
	await genRequest(route, configInit);
};

export const deleteBand = async (ids, token) => {
	const configInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			bandIds: ids,
		}),
	};
	await genRequest(defaultRoute, configInit);
};
