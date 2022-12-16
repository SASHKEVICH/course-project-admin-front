import { genRequest } from "./genericRequest";

const defaultRoute = "/members";

export const getAllMembers = async (token) => {
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

export const createMember = async (name, token) => {
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

export const updateMember = async (member, token) => {
	const configInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			memberId: member.memberId,
			name: member.name,
			biography: member.biography,
			birthDate: member.birthDate != null ? new Date(member.birthDate) : null,
			dieDate: member.dieDate != null ? new Date(member.dieDate) : null,
			originCity: member.origin,
			photoPath: member.photoPath,
		}),
	};
	await genRequest(defaultRoute, configInit);
};

export const postMemberToBand = async (memberId, bandId, token) => {
	const configInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			bandId: bandId,
			memberId: memberId,
		}),
	};
	const route = defaultRoute + "/add-to-band";
	await genRequest(route, configInit);
};

export const deleteMember = async (ids, token) => {
	const configInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify({
			memberIds: ids,
		}),
	};
	await genRequest(defaultRoute, configInit);
};
