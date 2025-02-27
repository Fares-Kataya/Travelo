import {
	createElement,
	loadHeaderFooter,
	toggleActive,
	loadFromLocalStorage,
	// getData
} from "../JS/utility.js";
import {
	generateCalendar,
	renderCalendar,
	getMonthName,
	clearCalendarView,
} from "../JS/Calendar.js";
document.addEventListener("DOMContentLoaded", function () {
	loadHeaderFooter("header-container", "../HTML/header.html");
	loadHeaderFooter("footer-container", "../HTML/footer.html");
	// fetch();
	let count = parseInt(loadFromLocalStorage("count")) || 0;
	let planned_Trips = loadFromLocalStorage("planned-Trips") || [];

	for (let i = 0; i < count; i++) {
		planned_Trips.push(loadFromLocalStorage(`planned-Trips ${i}`));
	}
	planned_Trips.forEach((trip) => {
		addTrip(trip, false);
	});
document.getElementById("planned-Trips").addEventListener("click", function(event) {
			const card = event.target.closest(".trip-card");
			if (card) {
				console.log("Clicked card:", card);
			}
});
	document.getElementById("planned-Trips").addEventListener("mouseover", function(event) {
		const arrow = event.target.closest(".arrowDown");
		console.log("afas");	
		if (arrow) {
			console.log("Click");
				arrow.classList.add("show-arrow")
			}
	});
	document
		.getElementById("tripbtn")
		.addEventListener("click", () => new TripModal());
});

class TripModal {
	constructor() {
		this.overlay = this.createOverlay();
		this.trip = {};
		this.modal = this.createModal();
		this.overlay.appendChild(this.modal);
		document.body.appendChild(this.overlay);
		this.queryDestination();
		this.setupDestinationMap();
		this.setupEventListeners();
	}
	createOverlay() {
		return createElement("div", ["overlay"]);
	}
	createModal() {
		let modal = createElement("div", ["custom-modal"]);
		modal.appendChild(this.createModalHeader());
		let contentWrapper = createElement("div", ["content"]);
		contentWrapper.appendChild(this.createModalBody());
		contentWrapper.appendChild(this.createModalFooter());
		modal.appendChild(contentWrapper);
		return modal;
	}
	createModalHeader() {
		let header = createElement("div", ["modal-header"]);
		header.appendChild(createElement("h2", [], {}, "Create a New Trip"));
		header.appendChild(createElement("span", ["close"], {}, "X"));
		return header;
	}
	createModalBody() {
		let body = createElement("div", ["modal-body"], { id: "trip" });
		let tripDetails = createElement("div", ["container"], {
			id: "tripdetails",
		});
		tripDetails.appendChild(createElement("label", [], {}, "Trip Name"));
		tripDetails.appendChild(
			this.createInput("text", "name", "eg., Summer Vacation in Egypt")
		);
		tripDetails.appendChild(createElement("label", [], {}, "Destination"));
		tripDetails.appendChild(this.createInput("text", "Dest", "Destination"));
		tripDetails.appendChild(createElement("label", [], {}, "Description"));
		tripDetails.appendChild(
			this.createInput("textarea", "Desc", "Description")
		);
		tripDetails.appendChild(createElement("label", [], {}, "Date"));
		let dateInput = createElement("div", ["date-input-container"], {});
		dateInput.appendChild(this.createInput("date", "start-date", "Start Date"));
		dateInput.appendChild(this.createInput("date", "end-date", "End Date"));
		tripDetails.appendChild(dateInput);
		tripDetails.appendChild(
			createElement("button", [], { id: "add-Date" }, "+ Add dates/days")
		);
		body.appendChild(tripDetails);
		this.modalBody = body;
		return body;
	}
	createInput(type, id, placeholder) {
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
	createModalFooter() {
		let footer = createElement("div", ["modal-footer"]);
		let optionBtns = createElement("div", ["option-btns"]);
		optionBtns.appendChild(
			createElement("button", ["btn", "clear"], { id: "clear" }, "clear")
		);
		optionBtns.appendChild(
			createElement("button", ["btn", "apply"], { id: "apply" }, "Save")
		);
		let previewDiv = createElement("div", ["preview"], { id: "preview" });
		footer.appendChild(previewDiv);
		footer.appendChild(optionBtns);
		return footer;
	}
	setupEventListeners() {
		document
			.querySelector(".close")
			.addEventListener("click", () => this.close());
		document
			.querySelector(".clear")
			.addEventListener("click", () => this.clear());
		document
			.querySelector(".apply")
			.addEventListener("click", () => this.save());
		document.addEventListener("keydown", this.keyPress.bind(this));
		document
			.querySelector("#add-Date")
			.addEventListener("click", () => this.setupDateModal(this.overlay));
		
	}
	queryDestination() {
		let destination = this.modalBody.querySelector("#Dest");
		destination.addEventListener("input", () => { 

		});
	}
	async setupDestinationMap() {
		let map;
		let destination = this.modalBody.querySelector("#Dest");
		destination.addEventListener("change", function () {
			let destVal = destination.value.trim();
			fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					destVal
				)}&format=json`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data && data.length > 0) {
						let lat = parseFloat(data[0].lat);
						let lon = parseFloat(data[0].lon);
						let trip = document.getElementById("trip");
						let mapDiv = document.getElementById("preview");
						if (!mapDiv) {
							mapDiv = document.createElement("div");
							mapDiv.id = "map";
							trip.appendChild(mapDiv);
						}
						if (!map) {
							map = L.map(mapDiv).setView([lat, lon], 5);
							L.tileLayer(
								"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
								{
									attribution: "&copy; OpenStreetMap contributors",
								}
							).addTo(map);
						} else {
							map.setView([lat, lon], 5);
						}
						L.marker([lat, lon]).addTo(map).bindPopup(destVal).openPopup();
					} else {
						alert("Location not found. Please try another destination.");
					}
				});
		});
	}
	setupDateModal(overlay) {
		let dateModal = createElement("div", ["date-modal", "container"]);
		let dateOptions = this.createDateOptions();
		dateModal.appendChild(dateOptions);

		let { monthsDiv, monthHeading, nextButton, backButton } =
			this.createMonthsSection();
		let daysDiv = this.createDaysDiv();
		let hr = createElement("hr");

		dateModal.append(monthsDiv, daysDiv, hr);
		let currentMonthIndex = new Date().getMonth();
		let weeks = generateCalendar("2025", currentMonthIndex);
		renderCalendar(weeks, dateModal);

		let actionBtn = this.createActionButtons();
		dateModal.appendChild(actionBtn);

		nextButton.addEventListener("click", () => {
			currentMonthIndex = (currentMonthIndex + 1) % 12;
			this.updateCalendar(dateModal, currentMonthIndex, actionBtn);
			monthHeading.textContent = getMonthName(currentMonthIndex);
			console.log(getMonthName(currentMonthIndex));
		});
		backButton.addEventListener("click", () => {
			currentMonthIndex = (currentMonthIndex + 11) % 12;
			this.updateCalendar(dateModal, currentMonthIndex, actionBtn);
			monthHeading.textContent = getMonthName(currentMonthIndex);
		});

		let datesButton = dateOptions.querySelector("#datesBtn");
		let tripLengthButton = dateOptions.querySelector("#tripLenBtn");

		tripLengthButton.addEventListener("click", () => {
			toggleActive(tripLengthButton, datesButton);
			clearCalendarView(dateModal);
			this.renderTripLengthView(dateModal, actionBtn);
		});

		datesButton.addEventListener("click", () => {
			toggleActive(datesButton, tripLengthButton);
			clearCalendarView(dateModal);
			dateModal.append(dateOptions, monthsDiv, daysDiv, hr);
			weeks = generateCalendar("2025", currentMonthIndex);
			renderCalendar(weeks, dateModal);
			dateModal.appendChild(actionBtn);
		});
		overlay.appendChild(dateModal);
		const daysList = document.querySelectorAll(".day");
		let selectedStack = [];
		let bounds = [];
		let highlight = [];
		daysList.forEach((day) => {
			day.addEventListener("click", (event) => {
				let selectedNo = document.querySelectorAll(".selected");
				let Month_Days = event.target.parentElement.parentElement;
				// console.log(selectedNo.length)
				if (selectedNo.length < 2) {
					if (!event.target.classList.contains("selected")) {
						event.target.classList.add("selected");
						selectedStack.push(event.target.id);
						// console.log(selectedStack);
					} else {
						event.target.classList.remove("selected");
						selectedStack.pop(event.target.id);
					}
				} else {
					// console.log(selectedStack);
					document
						.getElementById(selectedStack.shift())
						.classList.remove("selected");
					highlight.forEach((day) =>
						document
							.querySelectorAll("#monthDays .day, #monthDays .empty")
							.forEach((dayDiv) => {
								dayDiv.classList.remove("highlight");
							})
					);
					// console.log(selectedStack);
				}
				if (selectedNo.length + 1 === 2) {
					let updatedSelected = document.querySelectorAll(".selected");
					updatedSelected.forEach((day) => bounds.push(day.innerHTML));
				}
				let lowerBound = bounds.shift();
				let upperBound = bounds.shift();

				highlight.push(lowerBound);
				console.log(lowerBound, upperBound);
				console.log(event.target.parentElement.parentElement);
				document
					.querySelectorAll("#monthDays .day, #monthDays .empty")
					.forEach((dayDiv) => {
						// console.log(lowerBound, upperBound);
						if (
							parseInt(dayDiv.innerHTML) > parseInt(lowerBound) &&
							parseInt(dayDiv.innerHTML) < parseInt(upperBound)
						) {
							highlight.push(dayDiv.innerHTML);
						}
					});
				highlight.push(upperBound);
				highlight.forEach((day) =>
					document
						.querySelectorAll("#monthDays .day, #monthDays .empty")
						.forEach((dayDiv) => {
							if (parseInt(dayDiv.innerHTML) === parseInt(day)) {
								dayDiv.classList.add("highlighter");
							}
						})
				);
			});
		});
		setTimeout(() => dateModal.classList.add("open"), 10);
	}
	createDateOptions() {
		let header = createElement("h2", [], {}, "Add dates or Trip Length");
		let datesButton = createElement(
			"button",
			["active-date"],
			{ id: "datesBtn" },
			"Dates(MM/DD)"
		);
		let tripLengthButton = createElement(
			"button",
			["inactive-date"],
			{ id: "tripLenBtn" },
			"Trip Length"
		);
		let buttonsDiv = createElement("div", ["container"], {
			id: "date-options-buttons",
		});
		buttonsDiv.append(datesButton, tripLengthButton);

		let dateOptions = createElement("div", ["container"], {
			id: "date-options",
		});
		dateOptions.append(header, buttonsDiv);
		return dateOptions;
	}
	createMonthsSection() {
		let monthsDiv = createElement("div", [], { id: "months" });
		let backImg = createElement("img", [], {
			src: "../Assets/icons/back-svgrepo-com.svg",
		});
		let backButton = createElement("button", [], {});
		backButton.appendChild(backImg);

		let monthHeading = createElement(
			"h4",
			[],
			{},
			getMonthName(new Date().getMonth())
		);
		let nextImg = createElement("img", [], {
			src: "../Assets/icons/next-svgrepo-com.svg",
		});
		let nextButton = createElement("button", [], {});
		nextButton.appendChild(nextImg);

		monthsDiv.append(backButton, monthHeading, nextButton);
		return { monthsDiv, monthHeading, nextButton, backButton };
	}
	createDaysDiv() {
		let daysDiv = createElement("div", [], { id: "weekdays" });
		let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		days.forEach((day) => {
			let dayDiv = createElement("div", ["weekDaysDivs"], { id: day }, day);
			daysDiv.appendChild(dayDiv);
		});
		return daysDiv;
	}
	createActionButtons() {
		let actionBtn = createElement("div", ["action-btns"]);
		let clearBtn = createElement(
			"button",
			["clear"],
			{ id: "clear-days" },
			"Clear"
		);
		let applyBtn = createElement("button", ["apply"], { id: "apply" }, "Apply");
		actionBtn.append(clearBtn, applyBtn);
		return actionBtn;
	}
	updateCalendar(modal, monthIndex, actionBtn) {
		clearCalendarView(modal);
		let weeks = generateCalendar("2025", monthIndex);
		renderCalendar(weeks, modal);
		modal.appendChild(actionBtn);
	}
	renderTripLengthView(modal, actionBtn) {
		let TLcontainer = createElement("div", ["container"], {
			id: "tripLengthContainer",
		});
		let TLheader = createElement("h5", [], {}, "Number of Days");
		let pmDays = createElement("div", [], { id: "pmDays" });
		let daysContainer = createElement("div", [], { id: "daysContainer" });
		let days = createElement("p", [], {}, "0");
		daysContainer.appendChild(days);

		let plusButton = createElement("button", ["tripLenBtn"], {}, "+");
		let minusButton = createElement("button", ["tripLenBtn"], {}, "-");
		pmDays.append(minusButton, daysContainer, plusButton);

		TLcontainer.append(TLheader, pmDays);
		modal.appendChild(TLcontainer);
		modal.appendChild(actionBtn);

		plusButton.addEventListener("click", () => {
			days.textContent = parseInt(days.textContent) + 1;
		});
		minusButton.addEventListener("click", () => {
			if (parseInt(days.textContent) > 0) {
				days.textContent = parseInt(days.textContent) - 1;
			}
		});

		let applyBtn = actionBtn.querySelector("#apply");
		let clearBtn = actionBtn.querySelector("#clear-days");
		applyBtn.addEventListener("click", () => {
			let dayCount = days.textContent;
			let calIcon = createElement("img", [], {
				id: "calendar-icon",
				src: "../Assets/icons/calendar.png",
			});
			let tripLengthPara = createElement("p", [], {}, `${dayCount} days`);
			this.trip.daysPara = tripLengthPara.innerHTML;
			let dateDiv = createElement("div", [], { id: "date" });
			dateDiv.append(calIcon, tripLengthPara);
			console.log(dateDiv.innerHTML);
			let currentModal = document.querySelector(".date-modal");
			if (currentModal) {
				currentModal.classList.remove("open");
				setTimeout(() => currentModal.remove(), 300);
			}
		});
		clearBtn.addEventListener("click", () => {
			days.textContent = "0";
		});
	}
	keyPress(e) {
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
	close() {
		this.overlay.remove();
	}
	clear() {
		document.querySelector("#name").value = "";
		document.querySelector("#Desc").value = "";
		document.querySelector("#Dest").value = "";
		document.querySelector("#start-date").value = "";
		document.querySelector("#end-date").value = "";
	}
	save() {
		this.trip.name = document.getElementById("name").value;
		this.trip.destination = document.getElementById("Dest").value;
		this.trip.description = document.getElementById("Desc").value;
		this.trip.startDate = document.getElementById("start-date").value;
		this.trip.endDate = document.getElementById("end-date").value;
		console.log(this.trip);
		addTrip(this.trip);
		let count = parseInt(loadFromLocalStorage("count")) || 0;
		count++;
		localStorage.setItem(`count`, count.toString());

		this.close();
	}
}
function addTrip(trip) {
	let placeholder = document.getElementById("empty");
	if (placeholder) placeholder.style.display = "none";
	let tripCard = createElement("div", ["card", "trip-card"], {});
	let details = createElement("div", ["card-img-overlay"], { id: "details" });
	let location = createElement("div", [], { id: "location" });
	let date = createElement("div", [], { id: "date" });
	date.appendChild(
		createElement("img", [], {
			id: "pinpoint",
			src: "../Assets/icons/calendar.png",
		})
	);
	if (trip.daysPara) {
		date.appendChild(
			createElement("h6", [], { id: "days-para" }, trip.daysPara)
		);
	} else {
		date.appendChild(
			createElement("h6", [], {}, trip.startDate + " - " + trip.endDate)
		);
	}
	location.appendChild(
		createElement("img", [], {
			id: "pinpoint",
			src: "../Assets/icons/pinpoint-svgrepo-com.svg",
		})
	);
	location.appendChild(createElement("h6", [], {}, trip.destination));
	details.appendChild(createElement("h2", [], {}, trip.name));
	details.appendChild(location);
	details.appendChild(date);
	details.appendChild(createElement("p", [], {}, trip.description));
	details.appendChild(createElement("img", ["arrowDown"], { id: "arrowDown", src: "../Assets/icons/back-svgrepo-com.svg", style: "" }));
	tripCard.appendChild(
		imageSelector(
			trip.destination,
			createElement("img", ["card-img", "img-fluid", "rounded-4"], {
				id: "destImg",
			})
		)
	);
	tripCard.appendChild(details);

	tripCard.addEventListener("click", () => {
    document.querySelectorAll(".card").forEach(c => {
      if(c !== tripCard) c.style.display = "none";
    });
    tripCard.querySelector("#arrowDown").style.display = "none";
    const cardContainer = tripCard.parentElement;
    const flexContainer = cardContainer.parentElement;
    let cardW = cardContainer.offsetWidth;
    let cardH = cardContainer.offsetHeight;
    const containerMaxWidth = flexContainer.offsetWidth;
    tripCard.classList.add("active");
    const timer = setInterval(() => {
      if (cardW < containerMaxWidth) {
        cardW += 20;
        cardH += 20;
        tripCard.style.width = cardW + "px";
        tripCard.style.height = cardH + "px";
        cardContainer.style.width = cardW + "px";
      } else {
        flexContainer.style.width = "100%";
        flexContainer.style.height = "200%";
        clearInterval(timer);
      }
    }, 1);
    renderItinerary(tripCard);
  });

	let plannedTrips = document.getElementById("planned-Trips"); 
	plannedTrips.appendChild(tripCard);
	
	let count = parseInt(loadFromLocalStorage("count")) || 0;
	localStorage.setItem(`planned-Trips ${count}`, JSON.stringify(trip));
}

let imageSelector = (destination, image) => {
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
	let date = card.querySelector("#date")
	let datetxt = ""
	if (date) {
		datetxt = date.getElementsByTagName("h6")[0].innerHTML;
	}
	let dateArr = datetxt.split("-");
	if (dateArr.length < 2) {
		console.log(parseInt(dateArr[0].split(" ")[0],10));
	} else {
	let fromDay   = parseInt(dateArr[2], 10);
	let fromMonth = parseInt(dateArr[1], 10) - 1;
	let fromYear = parseInt(dateArr[0], 10);
	let toDay   = parseInt(dateArr[5], 10);
	let toMonth = parseInt(dateArr[4], 10) - 1;
	let toYear = parseInt(dateArr[3], 10);
		
	let fromDate = new Date(fromYear, fromMonth, fromDay);
	let toDate = new Date(toYear, toMonth, toDay);
		
	let diffMs = toDate - fromDate;
	let diffDays = diffMs / (1000 * 60 * 60 * 24);
	}
	flexContainer = createElement('flex-container', ["Container"], { id: "itinerary-Container" });
	
}

// async function fetch(){
// const json = await getData(":searchText", "POST", {
//   "textQuery": "restaurants",
//   "languageCode": "",
//   "regionCode": "",
//   "rankPreference": 0,
//   "includedType": "",
//   "openNow": true,
//   "minRating": 0,
//   "maxResultCount": 1,
//   "priceLevels": [],
//   "strictTypeFiltering": true,
//   "locationBias": {
//     "circle": {
//       "center": {
//         "latitude": 40,
//         "longitude": -110
//       },
//       "radius": 10000
//     }
//   },
//   "evOptions": {
//     "minimumChargingRateKw": 0,
//     "connectorTypes": []
//   }
// })
// 	console.log(json);
// }
