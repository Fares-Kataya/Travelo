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
				"x-rapidapi-key": "9bc60aca4dmsh266b3af491c2b5dp1040c9jsn037bf8803753",
				"x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
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
	const body = createElement("div", ["modal-body"], { id: "trip" });
	let modalContentWrapper;
	if (config.contentWrapper) {
		modalContentWrapper = createElement("div", ["content"]);
	}
	config.body.forEach((div) => {
		if (typeof div === "string") {
			body.innerHTML += div;
		} else if (div instanceof HTMLElement) {
			body.appendChild(div);
		}
	});
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