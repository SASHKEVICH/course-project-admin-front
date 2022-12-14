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

export const getAlbumTypes = async (token) => {
	const configInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	const route = defaultRoute + "/types";
	const response = await genRequest(route, configInit);
	return response.body.types;
};

export const getBandsShort = async (token) => {
	const configInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	const route = "/bands/short";
	const response = await genRequest(route, configInit);
	return response.body.bands;
};

export const createAlbum = async (title, token) => {
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

export const updateAlbum = async (album, token) => {
	const configInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			albumId: album.album_id,
			title: album.title,
			coverPath: album.album_cover_path,
			released: album.released,
			explicit: album.explicit,
			history: album.history,
			type: album.type,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const postAlbumToBand = async (albumId, bandId, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			bandId: bandId,
			albumId: albumId,
			order: 1,
		}),
	};
	const route = defaultRoute + "/add-to-disc";
	await genRequest(route, configInit);
};

export const deleteAlbums = async (ids, token) => {
	const configInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			albumIds: ids,
		}),
	};
	await genRequest(defaultRoute, configInit);
};
