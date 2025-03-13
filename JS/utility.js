/**
 * Fetches data from the server using the Fetch API.
 * @param {String} url - The endpoint to be appended to the base API URL (e.g., ":searchNearby").
 * @param {String} method - The HTTP method to use (e.g., "GET", "POST").
 * @param {Object} [body] - The request body (required for methods like "POST").
 * @returns {Promise<Object>} The parsed JSON response from the API.
 */
export async function getData(
	url,
	method = "GET",
	body = {},
	customheaders = {}
) {
	try {
		// DON'T REMOVE THE HEADERS PROPERTY
		const options = {
			method,
			headers: {
				"x-rapidapi-key": "06c97ba8fbmshcc2f2887477377ep182d49jsn9f11b9aadd19",
				"x-rapidapi-host": "x-rapidapi-host: maps-data.p.rapidapi.com",
				"Content-Type": "application/json",
				"X-Goog-FieldMask": "*",
				...customheaders,
			},
		};

		if (body && ["POST"].includes(method)) {
			options["body"] = JSON.stringify(body);
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
	text = ""
) {
	if (!elementName.trim() && typeof element !== "string") {
		throw new Error("The element name should be a non-empty string");
	}
	const element = document.createElement(elementName);

	if (attributes && typeof attributes === "object") {
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
export function loadHeaderFooter(elementID, filePath) {
	fetch(filePath)
		.then((response) => response.text())
		.then((data) => {
			document.getElementById(elementID).innerHTML = data;
		})
		.catch((error) => console.error("Error loading component:", error));
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
	activeBtn.classList.add("active-date");
	activeBtn.classList.remove("inactive-date");
	inactiveBtn.classList.add("inactive-date");
	inactiveBtn.classList.remove("active-date");
}

export function createModal(config, classlist, attributes) {
	//main Modal Container
	const modal = createElement("div", classlist, attributes);
	// header Container
	const header = createElement("div", ["modal-header"]);

	if (config.header && config.header.title) {
		const title = createElement("h2", [], {}, config.header.title);
		header.appendChild(title);
	}
	if (config.header.closeBtn) {
		const closeBtn = createElement("span", ["close"], {}, "X");
		closeBtn.addEventListener("click", () => {
			if (typeof config.header.onClose === "function") {
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
				typeof btnConfig.attributes === "object" ? btnConfig.attributes : {};
			const button = createElement(
				"button",
				btnClasses,
				btnAttr,
				btnConfig.text
			);
			if (typeof btnConfig.onClick === "function") {
				button.addEventListener("click", btnConfig.onClick);
			}
			config.header.buttonsContainer.appendChild(button);
		});
		header.appendChild(config.header.buttonsContainer);
	}
	modal.appendChild(header);

	// body Container
	const body = createElement("div", ["modal-body"], { id: config.body.id });
	let modalContentWrapper;
	if (config.contentWrapper[0]) {
		modalContentWrapper = createElement("div", [config.contentWrapper[1]]);
	}
	if (config.body.divs.length > 1) {
		config.body.divs.forEach((div) => {
			if (typeof div === "string") {
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
	const footer = createElement("div", ["modal-footer"]);
	if (config.footer && Array.isArray(config.footer.buttons)) {
		config.footer.buttons.forEach((btnConfig) => {
			const btnClasses = Array.isArray(btnConfig.classes)
				? btnConfig.classes
				: [];
			const btnAttr =
				typeof btnConfig.attributes === "object" ? btnConfig.attributes : {};
			const button = createElement(
				"button",
				btnClasses,
				btnAttr,
				btnConfig.text
			);
			if (typeof btnConfig.onClick === "function") {
				button.addEventListener("click", btnConfig.onClick);
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
	if (type === "textarea") {
		return createElement("textarea", ["trip-in"], {
			id: id,
			placeholder: placeholder,
		});
	}
	if (type === "date") {
		return createElement("input", ["trip-in", "date-in"], {
			type: type,
			id: id,
			placeholder: placeholder,
		});
	}
	return createElement("input", ["trip-in"], {
		type: type,
		id: id,
		placeholder: placeholder,
	});
}
/**
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
  lang = "en"
) {
  const apiKey = "06c97ba8fbmshcc2f2887477377ep182d49jsn9f11b9aadd19";
  const url = `https://maps-data.p.rapidapi.com/searchmaps.php?query=${encodeURIComponent(query)}&limit=${limit}&country=${country}&lang=${lang}&lat=${lat}&lng=${lng}&offset=${offset}&zoom=${zoom}`;

  const headers = {
    "x-rapidapi-host": "maps-data.p.rapidapi.com",
    "x-rapidapi-key": apiKey,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search data:", error);
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
  const apiKey = "06c97ba8fbmshcc2f2887477377ep182d49jsn9aadd19";
  const url = `https://maps-data.p.rapidapi.com/photos.php?business_id=${encodeURIComponent(businessId)}&lang=en`;
  
  const headers = {
    "x-rapidapi-host": "maps-data.p.rapidapi.com",
    "x-rapidapi-key": apiKey,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching place photos:", error);
    return null;
  }
}
