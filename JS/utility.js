const keys = [
	'20b4800490msh4213a96bd695313p1772dcjsn4921896a0a5e',
	'9bc60aca4dmsh266b3af491c2b5dp1040c9jsn037bf8803753',
	'c24798c951msh4eda091ce8c85c3p18e4dajsnd9b94fe9388a',
];
let currentKey = 2;
/**
 * Fetches data from the server using the Fetch API.
 * @param {String} url - The endpoint to be appended to the base API URL (e.g., ":searchNearby").
 * @param {String} method - The HTTP method to use (e.g., "GET", "POST").
 * @param {String} params - The parameters to be sent with the GET request.
 * @param {Object} [body] - The request body (required for methods like "POST").
 * @returns {Promise<Object>} The parsed JSON response from the API.
 */
export async function getData(
	url,
	params = '',
	method = 'GET',
	body = {},
	customheaders = {}
) {
	try {
		// DON'T REMOVE THE HEADERS PROPERTY
		const options = {
			method,
			headers: {
				'x-rapidapi-key': keys[currentKey],
				'x-rapidapi-host': 'maps-data.p.rapidapi.com',
				...customheaders,
			},
		};

		if (body && ['POST'].includes(method)) {
			options['body'] = JSON.stringify(body);
		}

		if (!params) {
			throw new Error('There must be parameters');
		}

		const response = await fetch(
			`https://maps-data.p.rapidapi.com/${url}?${params}`,
			options
		);

		if (!response.ok) {
			if (response.status === 429) {
				if (currentKey === keys.length - 1) {
					currentKey = 0;
				} else {
					currentKey++;
				}
			}
			throw new Error(`Error: ${response.status} - ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}

/**
 * This function is used to delay a callback function passed to it as a parameter
 * (usually used with getData method while being used in search)
 * @param {Function} callBack
 * @param {number} delay
 * @returns new function that delays the callback function
 */
export function debounce(callBack, delay = 1000) {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			callBack(...args);
		}, delay);
	};
}

export function getURLQueries() {
	const queries = location.search
		.slice(1)
		.split('&')
		.map((item) => {
			let key_value = item.split('=');
			let key = key_value[0];
			let value = key_value[1];
			return { [key]: value };
		});

	return queries;
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

	if (attributes && typeof attributes === 'object') {
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
/**
 * Loads HTML content from a file and injects it into an element with the given ID.
 *
 * @param {string} elementID - The ID of the DOM element where the content will be loaded.
 * @param {string} filePath - The path to the HTML file to load.
 */
export async function loadHeaderFooter(filePath) {
	// fetch(filePath)
	// 	.then((response) => response.text())
	// 	.then((data) => {
	// 		document.getElementById(elementID).innerHTML = data;
	// 	})
	// 	.catch((error) => console.error('Error loading component:', error));

	let res = await fetch(filePath);
	return await res.text();
}
/**
 * Loads data from local storage.
 *
 * @param {string} key - The key to look up in local storage.
 * @param {*} [defaultValue=null] - A default value to return if the key is not found or parsing fails.
 * @returns {*} The parsed data from local storage, or the default value.
 */
export function loadFromLocalStorage(key, defaultValue = null) {
	try {
		const storedData = localStorage.getItem(key);
		if (storedData === null) {
			return defaultValue;
		}
		return JSON.parse(storedData);
	} catch (error) {
		console.error(`Error loading local storage key "${key}":`, error);
		return defaultValue;
	}
}
/**
 * Toggles the active/inactive classes between two buttons or elements.
 *
 * @param {HTMLElement} activeBtn - The element to be set as active.
 * @param {HTMLElement} inactiveBtn - The element to be set as inactive.
 */
export function toggleActive(activeBtn, inactiveBtn) {
	activeBtn.classList.add('active-date');
	activeBtn.classList.remove('inactive-date');
	inactiveBtn.classList.add('inactive-date');
	inactiveBtn.classList.remove('active-date');
}

export function createModal(config, classlist, attributes) {
	//main Modal Container
	const modal = createElement('div', classlist, attributes);
	// header Container
	const header = createElement('div', ['modal-header']);

	if (config.header && config.header.title) {
		const title = createElement('h2', [], {}, config.header.title);
		header.appendChild(title);
	}
	if (config.header.closeBtn) {
		const closeBtn = createElement('span', ['close'], {}, 'X');
		closeBtn.addEventListener('click', () => {
			if (typeof config.header.onClose === 'function') {
				config.header.onClose();
			}
		});
		header.appendChild(closeBtn);
	}
	if (config.header && Array.isArray(config.header.buttons)) {
		config.header.buttons.forEach((btnConfig) => {
			const btnClasses = Array.isArray(btnConfig.classes)
				? btnConfig.classes
				: [];
			const btnAttr =
				typeof btnConfig.attributes === 'object' ? btnConfig.attributes : {};
			const button = createElement(
				'button',
				btnClasses,
				btnAttr,
				btnConfig.text
			);
			if (typeof btnConfig.onClick === 'function') {
				button.addEventListener('click', btnConfig.onClick);
			}
			config.header.buttonsContainer.appendChild(button);
		});
		header.appendChild(config.header.buttonsContainer);
	}
	modal.appendChild(header);

	// body Container
	const body = createElement('div', ['modal-body'], { id: config.body.id });
	let modalContentWrapper;
	if (config.contentWrapper[0]) {
		modalContentWrapper = createElement('div', [config.contentWrapper[1]]);
	}
	if (config.body.divs.length > 1) {
		config.body.divs.forEach((div) => {
			if (typeof div === 'string') {
				body.innerHTML += div;
			} else if (div instanceof HTMLElement) {
				body.appendChild(div);
			}
		});
	} else {
		body.appendChild(config.body.divs[0]);
	}

	modalContentWrapper.appendChild(body);

	//footer Container
	const footer = createElement('div', ['modal-footer']);
	if (config.footer && Array.isArray(config.footer.buttons)) {
		config.footer.buttons.forEach((btnConfig) => {
			const btnClasses = Array.isArray(btnConfig.classes)
				? btnConfig.classes
				: [];
			const btnAttr =
				typeof btnConfig.attributes === 'object' ? btnConfig.attributes : {};
			const button = createElement(
				'button',
				btnClasses,
				btnAttr,
				btnConfig.text
			);
			if (typeof btnConfig.onClick === 'function') {
				button.addEventListener('click', btnConfig.onClick);
			}
			config.footer.buttonsContainer.appendChild(button);
		});
		footer.appendChild(config.footer.buttonsContainer);
	}
	modal.appendChild(modalContentWrapper);
	modal.appendChild(footer);
	return modal;
}
export function createInput(type, id, placeholder) {
	if (type === 'textarea') {
		return createElement('textarea', ['trip-in'], {
			id: id,
			placeholder: placeholder,
		});
	}
	if (type === 'date') {
		return createElement('input', ['trip-in', 'date-in'], {
			type: type,
			id: id,
			placeholder: placeholder,
		});
	}
	return createElement('input', ['trip-in'], {
		type: type,
		id: id,
		placeholder: placeholder,
	});
}

/**
 * When you use it add class position-relative to its parent first
 * @returns Spinner node for loading
 */
export function generateSpinner() {
	const container = createElement('div', [
		'position-absolute',
		'start-50',
		'top-50',
		'translate-middle',
	]);
	const div = createElement('div', ['spinner-border', 'text-danger'], {
		role: 'status',
	});
	let span = createElement('span', ['visually-hidden']);
	container.appendChild(div);
	div.appendChild(span);
	return container;
}

/**
 * NOTE: Use it with placeDetails endpoint only
 * Extracts important data from the API response object.
 * @param {Object} obj API response object
 * @returns {Promise<Object>} A new object with the needed data
 */
export async function createObj(obj) {
	let newObj = {
		name: obj?.name || '',
		current_opening_hours: obj?.current_opening_hours || {},
		formatted_address: obj?.formatted_address || '',
		formatted_phone_number: obj?.formatted_phone_number || '',
		id: obj?.place_id || null,
		location: obj?.geometry?.location || {},
		wheelchair_accessible_entrance:
			obj?.wheelchair_accessible_entrance || false,
		types: obj?.types || '',
		rating: obj?.rating || 0,
		reviews: obj?.reviews || [],
		user_ratings_total: obj?.user_ratings_total || 0,
		photos: [],
	};

	if (obj?.photos?.length > 0) {
		const photosRequest = obj.photos
			.slice(0, 1) // number of photos needed (Change the second argument)
			.map(async (photo, index) => {
				try {
					const data = await getData(
						`/photo?photo_reference=${photo.photo_reference}`
					);

					return { id: index + 1, src: data.photoUri };
				} catch (error) {
					console.log(error);
					return null;
				}
			});

		const photos = await Promise.all(photosRequest); // Resolves all the promises in the photosRequest array (it's an Array of promises)
		newObj.photos = photos.filter(Boolean); // Removes the null values
	}
	return newObj;
}

export function getLatLong() {
	return new Promise((resolve, reject) => {
		let geo = {
			latitude: 30.059482,
			longitude: 31.299664,
		};
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					geo.latitude = position.coords.latitude;
					geo.longitude = position.coords.longitude;
					resolve(geo); // Return the updated geo object after the position is retrieved
				},
				(error) => {
					reject(error); // Reject the promise if there is an error
				}
			);
		} else {
			reject(new Error('Geolocation is not supported on this browser'));
		}
	});
}
/**
 * This Class used to generate an object of the body of the request
 * that should be sent with the Google places API request
 */
export class RequestBody {
	constructor(
		region,
		types = ['restaurant', 'hotel', 'park', 'beach'],
		resultCount = 1,
		lat = 30.059482,
		long = 31.299664,
		radius = 5000,
		preference = 0
	) {
		this.languageCode = 'en';
		this.regionCode = region || '';
		this.includedTypes = Array.isArray(types) ? [...types] : [];
		this.maxResultCount =
			typeof resultCount === 'number' && resultCount > 0 ? resultCount : 50;
		this.locationRestriction = {
			circle: {
				center: {
					latitude: typeof lat === 'number' ? lat : 30.059482,
					longitude: typeof long === 'number' ? long : 31.299664,
				},
				radius: typeof radius === 'number' && radius >= 1000 ? radius : 5000,
			},
		};
		this.rankPreference = preference;
	}

	setRegion(reg) {
		try {
			if (typeof reg === 'string') {
				this.regionCode = reg;
			} else {
				throw new Error('Region should be string');
			}
		} catch (error) {
			console.error(error);
		}
	}

	getRegion() {
		return this.regionCode;
	}

	setTypes(types) {
		try {
			if (Array.isArray(types)) {
				this.includedTypes = [...types];
			} else {
				throw new Error('Types should be an array');
			}
		} catch (error) {
			console.error(error);
		}
	}

	getTypes() {
		return this.includedTypes;
	}

	setResultCount(count) {
		try {
			if (typeof count === 'number' && count > 0) {
				this.maxResultCount = count;
			} else {
				throw new Error('The count should be bigger than 0 and type of number');
			}
		} catch (error) {
			console.error(error);
		}
	}

	getResultCount() {
		return this.maxResultCount;
	}

	setLocation(lat, long, radius = this.locationRestriction.circle.radius) {
		try {
			if (typeof lat !== 'number') {
				throw new Error('the latitude should be a number');
			}
			if (typeof long !== 'number') {
				throw new Error('the longitude should be a number');
			}
			if (typeof radius !== 'number' && radius >= 1000) {
				throw new Error('the longitude should be a number');
			}
			this.locationRestriction = {
				circle: {
					center: {
						latitude: lat,
						longitude: long,
					},
					radius: radius,
				},
			};
		} catch (error) {
			console.error(error);
		}
	}

	getLocation() {
		return this.locationRestriction;
	}

	setPreference(preference) {
		this.rankPreference = preference;
	}

	getPreference() {
		return this.rankPreference;
	}
}
/*
 * Searches for places using the Maps Data API via RapidAPI.
 *
 * @param {string} query - The search term (e.g., "restaurant").
 * @param {string} country - The country code (e.g., "us").
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @param {number} [limit=20] - Maximum number of results.
 * @param {number} [offset=0] - Offset for pagination.
 * @param {number} [zoom=13] - Zoom level (affects the search area).
 * @param {string} [lang="en"] - Language for the results.
 * @returns {Promise<Object>} The API response parsed as JSON.
 */
export async function searchPlacesData(
	query,
	country,
	lat,
	lng,
	limit = 20,
	offset = 0,
	zoom = 13,
	lang = 'en'
) {
	const apiKey = keys[currentKey];
	const url = `https://maps-data.p.rapidapi.com/searchmaps.php?query=${encodeURIComponent(
		query
	)}&limit=${limit}&country=${country}&lang=${lang}&lat=${lat}&lng=${lng}&offset=${offset}&zoom=${zoom}`;

	const headers = {
		'x-rapidapi-host': 'maps-data.p.rapidapi.com',
		'x-rapidapi-key': apiKey,
	};

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching search data:', error);
		return null;
	}
}
/**
 * Fetches place photos using the Maps Data API via RapidAPI.
 *
 * @param {string} businessId - The business_id for the place.
 * @param {string} [lang="en"] - The language for the response.
 * @param {string} [country="us"] - The country code.
 * @returns {Promise<Object|null>} A promise that resolves with the photo data (or null on error).
 */
export async function getPlacePhotos(businessId) {
	const apiKey = keys[currentKey];
	const url = `https://maps-data.p.rapidapi.com/photos.php?business_id=${encodeURIComponent(
		businessId
	)}&lang=en`;

	const headers = {
		'x-rapidapi-host': 'maps-data.p.rapidapi.com',
		'x-rapidapi-key': apiKey,
	};

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching place photos:', error);
		return null;
	}
}
