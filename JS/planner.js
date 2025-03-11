import {
	createElement,
	loadHeaderFooter,
	toggleActive,
	loadFromLocalStorage,
	getData,
	createModal,
	createInput,
} from "../JS/utility.js";
import { setupDestinationMap } from "../JS/Map.js";
import {
	setupDateModal,
	dateDivFromModal,
	resetDateDivFromModal,
	startCalDate,
	endCalDate,
} from "../JS/Calendar.js";
document.addEventListener("DOMContentLoaded", loadPage);
initEvents();

function loadPage() {
	loadHeaderFooter("header-container", "../HTML/header.html");
	loadHeaderFooter("footer-container", "../HTML/footer.html");
	let count = parseInt(loadFromLocalStorage("count")) || 0;
	let planned_Trips = loadFromLocalStorage("planned-Trips") || [];
	for (let i = 0; i < count; i++) {
		planned_Trips.push(loadFromLocalStorage(`planned-Trips ${i}`));
	}
	planned_Trips.forEach((trip) => {
		addTrip(trip);
	});
}
function initEvents() {
	document.querySelector("#tripbtn").addEventListener("click", createTrip);
	document.addEventListener("keydown", keyPress);
	document.body.addEventListener("click", function (e) {
		if (e.target && e.target.id === "add-Date") {
			setupDateModal(document.querySelector(".overlay"));
		}
	});
}
function createTrip() {
	const overlay = createElement("div", ["overlay"]);
	const tripDetails = createElement("div", ["container"], {
		id: "tripdetails",
	});
	let dateInput = createElement("div", ["date-input-container"], {});
	dateInput.append(
		createInput("date", "start-date", "Start Date"),
		createInput("date", "end-date", "End Date")
	);
	tripDetails.append(
		createElement("label", [], {}, "Trip Name"),
		createInput("text", "name", "eg., Summer Vacation in Egypt"),
		createElement("label", [], {}, "Destination"),
		createInput("text", "Dest", "Destination"),
		createElement("label", [], {}, "Description"),
		createInput("textarea", "Desc", "Description"),
		createElement("label", [], {}, "Date"),
		dateInput,
		createElement("button", [], { id: "add-Date" }, "+ Add dates/days")
	);
	let optionBtns = createElement("div", ["option-btns"]);
	let previewDiv = createElement("div", ["preview"], { id: "preview" });
	const modalConfig = {
		header: {
			title: "Create a New Trip",
			closeBtn: true,
			onClose: close,
		},
		contentWrapper: true,
		body: [tripDetails, previewDiv],
		contentWrapper: true,
		footer: {
			buttonsContainer: optionBtns,
			buttons: [
				{
					text: "Clear",
					classes: ["btn", "clear"],
					attributes: { id: "clear" },
					onClick: clear,
				},
				{
					text: "Save",
					classes: ["btn", "apply"],
					attributes: { id: "apply" },
					onClick: () => {
						save({
							name: modalConfig.body[0].childNodes[1].value,
							dest: modalConfig.body[0].childNodes[3].value,
							desc: modalConfig.body[0].childNodes[5].value,
							startDate: document.getElementById("start-date").value || startCalDate,
							endDate: document.getElementById("end-date").value || endCalDate,
						});
					},
				},
			],
		},
	};

	const modalElement = createModal(modalConfig, ["custom-modal"]);
	setupDestinationMap(modalElement.querySelector("#Dest"));
	overlay.appendChild(modalElement);
	document.body.appendChild(overlay);
}
function clear() {
	document.querySelector("#name").value = "";
	document.querySelector("#Desc").value = "";
	document.querySelector("#Dest").value = "";
	document.querySelector("#start-date").value = "";
	document.querySelector("#end-date").value = "";
}
function save(trip) {
	addTrip(trip);
	let count = parseInt(loadFromLocalStorage("count")) || 0;
	count++;
	localStorage.setItem(`count`, count.toString());
	close();
}
function close() {
	const modal = document.querySelector(".custom-modal");
	if (modal.parentElement.classList[0] === "overlay") {
		modal.parentElement.remove();
		modal.remove();
	} else {
		modal.remove();
	}
}
function keyPress(e) {
	if (e.key === "Escape") {
		let dateModal = document.querySelector(".date-modal");
		let mainModal = document.querySelector(".custom-modal");
		let overlay = document.querySelector(".overlay");
		if (dateModal) {
			overlay.removeChild(dateModal);
		} else if (mainModal) {
			document.body.removeChild(overlay);
		}
	}
}
function addTrip(trip) {
	const placeholder = document.getElementById("empty");
	if (placeholder) placeholder.style.display = "none";
	const tripCard = buildTripCard(trip);
	setupTripCardAnimation(tripCard);
	appendTripCard(tripCard);
	saveTripToLocalStorage(trip);
}
function buildTripCard(trip) {
	const tripCard = createElement(
		"div",
		["card", "trip-card", "inactive-card"],
		{}
	);
	const details = createElement("div", ["card-img-overlay"], { id: "details" });
	details.appendChild(createElement("h2", [], {}, trip.name));
	const location = createElement("div", [], { id: "location" });
	location.appendChild(
		createElement("img", [], {
			id: "pinpoint",
			src: "../Assets/icons/pinpoint-svgrepo-com.svg",
		})
	);
	location.appendChild(createElement("h6", [], {}, trip.dest));
	const date = createElement("div", [], { id: "date" });
	date.appendChild(
		createElement("img", [], {
			id: "pinpoint",
			src: "../Assets/icons/calendar.png",
		})
	);
	console.log("first");
	let daysPara = dateDivFromModal;
	console.log(trip.startDate);
	const dateText = daysPara
		? daysPara.childNodes[1].textContent
		: `${trip.startDate} - ${trip.endDate}`;
	date.appendChild(
		createElement("h6", [], trip.daysPara ? { id: "days-para" } : {}, dateText)
	);
	resetDateDivFromModal();
	details.appendChild(location);
	details.appendChild(date);
	details.appendChild(createElement("p", [], {}, trip.desc));
	details.appendChild(
		createElement("img", ["arrowDown", "hide"], {
			id: "arrowDown",
			src: "../Assets/icons/back-svgrepo-com.svg",
			style: "",
		})
	);
	const destImg = createElement("img", ["card-img", "img-fluid", "rounded-4"], {
		id: "destImg",
	});
	tripCard.appendChild(imageSelector(trip.dest, destImg));
	tripCard.appendChild(details);

	return tripCard;
}

function setupTripCardAnimation(tripCard) {
	let originalWidth, originalHeight, detailsOriginalHeight;

	tripCard.addEventListener("click", (event) => {
		if (event.target.closest("#itinerary-Container")) return;

		document.querySelectorAll(".card").forEach((c) => {
			if (c !== tripCard) c.style.display = "none";
		});
		const arrow = tripCard.querySelector(".arrowDown");
		toggleArrow(arrow, false);

		const cardContainer = tripCard.parentElement;
		const flexContainer = cardContainer.parentElement;
		let currentWidth = tripCard.offsetWidth;
		let currentHeight = tripCard.offsetHeight;
		const containerMaxWidth = flexContainer.offsetWidth;

		if (!originalWidth) {
			originalWidth = currentWidth;
			originalHeight = currentHeight;
			const computedStyle = window.getComputedStyle(tripCard);
			if (computedStyle.height !== "auto") {
				originalHeight = parseInt(computedStyle.height);
			}
			const detailsDiv = tripCard.querySelector("#details");
			const detailsComputedStyle = window.getComputedStyle(detailsDiv);
			detailsOriginalHeight =
				detailsComputedStyle.height !== "auto"
					? parseInt(detailsComputedStyle.height)
					: detailsDiv.offsetHeight;
		}
		const collapseAnimation = () => {
			if (currentWidth > originalWidth) {
				currentWidth -= 20;
				currentHeight -= 20;
				updateDimensions(tripCard, cardContainer, currentWidth, originalHeight);
				const detailsElem = tripCard.querySelector("#details");
				if (detailsElem) detailsElem.style.height = detailsOriginalHeight;
				requestAnimationFrame(collapseAnimation);
			} else {
				resetDimensions(tripCard, cardContainer);
				const itinerary = tripCard.querySelector("#itinerary-Container");
				if (itinerary) itinerary.style.display = "none";
				flexContainer.style.height = "auto";
				document
					.querySelectorAll(".card")
					.forEach((c) => (c.style.display = "flex"));
				toggleArrow(arrow, true);
			}
		};
		const expandAnimation = () => {
			if (currentWidth < containerMaxWidth) {
				currentWidth += 20;
				currentHeight += 10;
				updateDimensions(tripCard, cardContainer, currentWidth, currentHeight);
				requestAnimationFrame(expandAnimation);
			} else {
				flexContainer.style.width = "100%";
				flexContainer.style.height = "200%";
				renderItinerary(tripCard);
			}
		};
		if (tripCard.classList.contains("active-card")) {
			tripCard.classList.replace("active-card", "inactive-card");
			requestAnimationFrame(collapseAnimation);
		} else {
			tripCard.classList.replace("inactive-card", "active-card");
			requestAnimationFrame(expandAnimation);
		}
	});
}

function updateDimensions(card, container, width, height) {
	card.style.width = `${width}px`;
	card.style.height = `${height}px`;
	container.style.width = `${width}px`;
	container.style.height = `${height}px`;
}

function resetDimensions(card, container) {
	card.style.removeProperty("width");
	card.style.removeProperty("height");
	container.style.removeProperty("width");
	container.style.removeProperty("height");
}

function toggleArrow(arrow, show) {
	if (arrow) {
		arrow.classList.toggle("hide", !show);
		arrow.classList.toggle("show", show);
	}
}

function appendTripCard(tripCard) {
	const plannedTrips = document.getElementById("planned-Trips");
	plannedTrips.classList.add("active-article");
	plannedTrips.appendChild(tripCard);
	plannedTrips.querySelectorAll(".trip-card").forEach((trip) => {
		trip.addEventListener("mouseover", () => {
			const arrow = trip.querySelector(".arrowDown");
			if (arrow && trip.classList.contains("inactive-card")) {
				toggleArrow(arrow, true);
			}
		});
		trip.addEventListener("mouseout", () => {
			const arrow = trip.querySelector(".arrowDown");
			if (arrow) {
				toggleArrow(arrow, false);
			}
		});
	});
}

function saveTripToLocalStorage(trip) {
	let count = parseInt(loadFromLocalStorage("count")) || 0;
	localStorage.setItem(`planned-Trips ${count}`, JSON.stringify(trip));
}
let imageSelector = (destination = "", image) => {
	if (destination.toLowerCase() === "spain") {
		image.src = "../Assets/images/logan-armstrong-hVhfqhDYciU-unsplash.jpg";
	} else if (destination.toLowerCase() === "united kingdom") {
		image.src = "../Assets/images/marcin-nowak-iXqTqC-f6jI-unsplash.jpg";
	} else if (destination.toLowerCase() === "egypt") {
		image.src = "../Assets/images/alex-azabache-MoonoldXeqs-unsplash.jpg";
	}
	return image;
};
function renderItinerary(card) {
	let date = card.querySelector("#date");
	let datetxt = "";
	let fromDate, toDate;
	if (date) {
		datetxt = date.getElementsByTagName("h6")[0].innerHTML;
	}
	let dateArr = datetxt.split("-");
	let diffDays;
	if (dateArr.length < 2) {
		diffDays = parseInt(dateArr[0].split(" ")[0], 10);
	} else {
		let fromDay = parseInt(dateArr[2], 10);
		let fromMonth = parseInt(dateArr[1], 10) - 1;
		let fromYear = parseInt(dateArr[0], 10);
		let toDay = parseInt(dateArr[5], 10);
		let toMonth = parseInt(dateArr[4], 10) - 1;
		let toYear = parseInt(dateArr[3], 10);

		fromDate = new Date(fromYear, fromMonth, fromDay);
		toDate = new Date(toYear, toMonth, toDay);
		let diffMs = toDate - fromDate + 1;
		diffDays = diffMs / (1000 * 60 * 60 * 24);
	}
	if (!card.querySelector("#itinerary-Container")) {
		var flexContainer = createElement("div", ["Container"], {
			id: "itinerary-Container",
		});
	} else {
		card.querySelector("#itinerary-Container").style.display = "flex";
	}
	let itineraryDetails = createElement("div", ["container"], {
		id: "itinerary-Details",
	});
	let placesPinedMap = createElement("div", ["container"], {
		id: "placesPinedMap",
	});
	// renderMap(card, placePinedMap);
	flexContainer.appendChild(itineraryDetails);
	const daysContainer = createElement("div", ["container"], {
		id: "daysContainer",
	});
	let dayDiv;
	let addItineraryBtn;
	for (let i = 0; i < diffDays; i++) {
		let dayHeader;
		let dispDate = new Date(fromDate);
		if (!fromDate && !toDate) {
			dayDiv = createElement("div", ["container", "daysDivs", "dayFlex"], {
				id: `day${i + 1}`,
			});
			dayHeader = createElement(
				"h3",
				["daysHeader"],
				{ id: `day${i + 1}-header` },
				`Day${i + 1}`
			);
		} else {
			dayDiv = createElement("div", ["container", "daysDivs", "dayFlex"], {
				id: `day${i + 1}`,
			});
			dispDate.setDate(fromDate.getDate() + i);
			dayHeader = createElement(
				"h3",
				["daysHeader"],
				{ id: `day${i + 1}-header` },
				dispDate.toDateString()
			);
		}
		const timnelineDiv = createElement("div", ["timelineDiv"], {
			id: "timeline",
		});
		addItineraryBtn = createElement(
			"button",
			["addItinerary"],
			{ id: `addItineraryBtn${i + 1}` },
			"+"
		);
		dayDiv.appendChild(dayHeader);
		dayDiv.appendChild(timnelineDiv);
		dayDiv.appendChild(addItineraryBtn);
		dayDiv.appendChild(createElement("hr"));
		daysContainer.appendChild(dayDiv);
	}
	itineraryDetails.appendChild(daysContainer);
	flexContainer.appendChild(placesPinedMap);
	flexContainer.style.zIndex = 1;
	card.querySelector("#details").appendChild(flexContainer);
	const itineraryOptions = createElement("div", ["it-options"]);
	const itineraryButtons = card.querySelectorAll(".addItinerary");
	itineraryButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			if (!btn.parentElement.querySelector("#it-options")) {
				btn.insertAdjacentElement("afterend", itineraryOptions);
			}
			if (!itineraryOptions.classList.contains("expand")) {
				itineraryOptions.style.display = "block";
				setTimeout(() => {
					itineraryOptions.classList.remove("collapse");
					itineraryOptions.classList.add("expand");
				}, 50);
			} else {
				itineraryOptions.classList.remove("expand");
				itineraryOptions.classList.add("collapse");
				itineraryOptions.style.display = "none";
			}
			itineraryOptions.classList.remove("collapse");
			itineraryOptions.classList.remove("expand");
		});
	});
	const accImg = createElement("img", ["OptIcon"], {
		src: "../Assets/icons/house_16203341.png",
	});
	const toDoImg = createElement("img", ["OptIcon"], {
		src: "../Assets/icons/address-location-icon.svg",
	});
	const addActivityBtn = createElement(
		"button",
		["it-option"],
		{ id: "activityOpt" },
		"Things to Do"
	);
	const addRestaurantBtn = createElement(
		"button",
		["it-option"],
		{ id: "restaurantOpt" },
		"Food & Drinks"
	);
	const addAccommodationBtn = createElement(
		"button",
		["it-option"],
		{ id: "accomodationOpt" },
		"Accommodation"
	);
	const addTransportBtn = createElement(
		"button",
		["it-option"],
		{ id: "transportationOpt" },
		"Transportation"
	);
	addAccommodationBtn.appendChild(accImg);
	addActivityBtn.appendChild(toDoImg);
	const optBtnsDiv = createElement("div", [], { id: "it-option" });
	optBtnsDiv.appendChild(addActivityBtn);
	optBtnsDiv.appendChild(addRestaurantBtn);
	optBtnsDiv.appendChild(addAccommodationBtn);
	optBtnsDiv.appendChild(addTransportBtn);
	itineraryOptions.appendChild(optBtnsDiv);
}
