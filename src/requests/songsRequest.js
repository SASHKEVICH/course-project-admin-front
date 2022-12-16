import { genRequest } from "./genericRequest";

const defaultRoute = "/songs";

export const getAllSongs = async (token) => {
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

export const createSong = async (title, token) => {
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

export const updateSong = async (song, token) => {
	const configInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			songId: song.songId,
			title: song.title,
			explicit: song.explicit,
			duration: song.duration,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const postSongToAlbum = async (songId, albumId, order, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			songId: songId,
			albumId: albumId,
			order: order,
		}),
	};
	const route = defaultRoute + "/add-to-album";
	await genRequest(route, configInit);
};

export const deleteSongs = async (ids, token) => {
	const configInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			songIds: ids,
		}),
	};
	await genRequest(defaultRoute, configInit);
};
