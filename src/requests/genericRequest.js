export const genRequest = async (request, configInit) => {
	const fullRequest = "http://localhost:4444" + request;
	console.log(fullRequest);
	const response = await fetch(fullRequest, configInit);
	const body = await response.json();
	console.log(body);
	if (response.status !== 200) {
		throw Error(body.message);
	}

	return body;
};
