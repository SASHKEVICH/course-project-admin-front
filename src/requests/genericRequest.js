export const genRequest = async (request, configInit) => {
	const response = await fetch(request, configInit);
	const body = await response.json();

	if (response.status < 200 || response.status >= 300) {
		throw Error(response.status);
	}
	return { status: response.status, body: body };
};
