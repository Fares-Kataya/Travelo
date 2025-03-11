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
				'x-rapidapi-key': '06c97ba8fbmshcc2f2887477377ep182d49jsn9f11b9aadd19',
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
	const body = createElement('div', ['modal-body'], { id: 'trip' });
	let modalContentWrapper;
	if (config.contentWrapper) {
		modalContentWrapper = createElement('div', ['content']);
	}
	config.body.forEach((div) => {
		if (typeof div === 'string') {
			body.innerHTML += div;
		} else if (div instanceof HTMLElement) {
			body.appendChild(div);
		}
	});
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
 * Extracts important data from the API response object.
 * @param {Object} obj API response object
 * @returns {Promise<Object>} A new object with the needed data
 */
export async function createObj(obj) {
	let newObj = {
		name: obj?.displayName?.text || '',
		allowsDogs: obj?.allowsDogs || false,
		currentOpeningHours: obj?.currentOpeningHours || {},
		openNow: obj?.regularOpeningHours?.openNow || false,
		periods: obj?.regularOpeningHours?.periods || [],
		weekdayDescriptions: obj?.regularOpeningHours?.weekdayDescriptions || [],
		formattedAddress: obj?.formattedAddress || '',
		id: obj?.id || null,
		location: obj?.location || {},
		details: obj?.name || '',
		parkingOptions: obj?.parkingOptions || {},
		type: obj?.primaryType || '',
		rating: obj?.rating || 0,
		reviews: obj?.reviews || [],
		userRatingCount: obj?.userRatingCount || 0,
		photos: [],
	};

	if (obj?.photos?.length > 0) {
		const photosRequest = obj.photos
			.slice(0, 1)
			.map(async (endPoint, index) => {
				try {
					const data = await getData(
						`/${endPoint.name.slice(
							endPoint.name.indexOf('/') + 1
						)}/media?maxWidthPx=400&maxHeightPx=400&skipHttpRedirect=true`
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
