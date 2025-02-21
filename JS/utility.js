/**
 * Fetches data from the server using the Fetch API.
 * @param {String} url - The endpoint to be appended to the base API URL (e.g., ":searchNearby").
 * @param {String} method - The HTTP method to use (e.g., "GET", "POST").
 * @param {Object} [body] - The request body (required for methods like "POST").
 * @returns {Promise<Object>} The parsed JSON response from the API.
 */
export async function getData(
	url,
	method = 'GET',
	body = {},
	customheaders = {}
) {
	try {
		// DON'T REMOVE THE HEADERS PROPERTY
		const options = {
			method,
			headers: {
				'x-rapidapi-key': '9bc60aca4dmsh266b3af491c2b5dp1040c9jsn037bf8803753',
				'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
				'Content-Type': 'application/json',
				'X-Goog-FieldMask': '*',
				...customheaders,
			},
		};

		if (body && ['POST'].includes(method)) {
			options['body'] = JSON.stringify(body);
		}

		const response = await fetch(
			`https://google-map-places-new-v2.p.rapidapi.com/v1/places${url}`,
			options
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} - ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}

/**
 * Creates and returns an HTML element with specified classes and attributes.
 * @param {String} elementName - The tag name of the element (e.g., "div", "span").
 * @param {Array} [classes] - An array of class names to be added to the element.
 * @param {Object} [attributes] - An object where keys are attribute names and values are attribute values.
 * @returns {HTMLElement} The created DOM element.
 */
export function createElement(
	elementName,
	classes = [],
	attributes = {},
	text = ''
) {
	if (!elementName.trim() && typeof element !== 'string') {
		throw new Error('The element name should be a non-empty string');
	}
	const element = document.createElement(elementName);

	if (attributes && typeof attributes === 'Object') {
		for (let key in attributes) {
			element.setAttribute(key, attributes[key]);
		}
	}

	if (classes && Array.isArray(classes)) {
		classes.forEach((className) => element.classList.add(className));
	}

	if (text) {
		element.textContent = text;
	}

	return element;
}
