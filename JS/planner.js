import { createElement, loadHeaderFooter } from "../JS/utility.js";
document.addEventListener("DOMContentLoaded", function () {
	loadHeaderFooter("header-container", "../HTML/header.html");
	loadHeaderFooter("footer-container", "../HTML/footer.html");
	let tripBtn = document.getElementById("tripbtn");
	tripBtn.addEventListener("click", openTripModal);
	function openTripModal() {
		let overlay = createElement("div", ["overlay"]);
		let modal = createElement("div", ["custom-modal"]);

		let header = createElement("h2", [], {}, "Create a New Trip");
		modal.appendChild(header);

		let tripContainer = createElement("div", [], { id: "trip" });
		modal.appendChild(tripContainer);
		let tripDetails = createElement("div", ["container"], { id: "tripdetails" });
		tripContainer.appendChild(tripDetails);

		let tripNameLabel = createElement("label", [], {}, "Trip Name");
		tripDetails.appendChild(tripNameLabel);
		let tripNameInput = createElement("input", [], {
			type: "text",
			placeholder: "eg., Summer Vacation in Egypt",
			id: "name",
		});
		tripDetails.appendChild(tripNameInput);

		let destinationLabel = createElement("label", [], {}, "Destination");
		tripDetails.appendChild(destinationLabel);
		let destinationInput = createElement("input", [], {
			type: "text",
			id: "Dest",
		});
		tripDetails.appendChild(destinationInput);

		let descriptionLabel = createElement("label", [], {}, "Description");
		tripDetails.appendChild(descriptionLabel);
		let descriptionTextarea = createElement("textarea", [], {
			id: "Desc",
		});
		tripDetails.appendChild(descriptionTextarea);

		let addDateButton = createElement(
			"button",
			[],
			{ id: "add-Date" },
			"+ Add dates/days"
		);
		tripDetails.appendChild(addDateButton);

		let createTripButton = createElement(
			"button",
			[],
			{ id: "createbtn" },
			"Create Trip"
		);
		tripDetails.appendChild(createTripButton);

		let closeModalButton = createElement(
			"button",
			[],
			{ id: "closeModal" },
			"X"
		);
		modal.appendChild(closeModalButton);

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		let closeModal = document.getElementById("closeModal");
		closeModal.addEventListener("click", () => {
			document.body.removeChild(overlay);
		});
		setupTripCreation(overlay);
		setupDestinationMap();
		setupDateModal(overlay, addDateButton);
	}
	function setupTripCreation(overlay) {
		let name = document.getElementById("name");
		let description = document.getElementById("Desc");
		let destination = document.getElementById("Dest");
		let addTrip = document.getElementById("createbtn");
		let trips = document.getElementById("planned-Trips");
		let placeholder = document.getElementById("empty");
		addTrip.addEventListener("click", () => {
			if (placeholder) placeholder.style.display = "none";
			let tripCard = createElement("div", ["card"], { id: "trip-card" });
			let title = createElement("h2", [], {}, name.value);
			let location = createElement("div", [], { id: "location" });
			let details = createElement("div", ["card-img-overlay"], { id: "details" });
			let imgDiv = createElement("div", ["image-fade"]);
			let pinpoint = createElement("img", [], { id: "pinpoint", src: "../Assets/icons/pinpoint-svgrepo-com.svg" });
			let destImg = createElement("img", ["card-img", "img-fluid", "rounded-4"], { id: "destImg" });
			let dest = createElement("h6", [], {}, destination.value);
			let desc = createElement("p", [], {}, description.value);
			imageSelector(dest, destImg);
			details.appendChild(title);
			location.appendChild(pinpoint);
			location.appendChild(dest);
			details.appendChild(location);
			details.appendChild(desc);
			tripCard.appendChild(destImg);
			tripCard.appendChild(details);
			trips.appendChild(tripCard);
			document.body.removeChild(overlay);
		});
	}
	function setupDestinationMap() {
		let map;
		let destination = document.getElementById("Dest");
		destination.addEventListener("input", function () {
			let destVal = destination.value.trim();
			fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					destVal
				)}&format=json`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data && data.length > 0) {
						let lat = data[0].lat;
						let lon = data[0].lon;
						let trip = document.getElementById("trip");
						let mapDiv = document.getElementById("map");
						if (!mapDiv) {
							mapDiv = document.createElement("div");
							mapDiv.id = "map";
							trip.appendChild(mapDiv);
						}
						if (!map) {
							map = L.map(mapDiv).setView([lat, lon], 10);
							L.tileLayer(
								"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
								{
									attribution: "&copy; OpenStreetMap contributors",
								}
							).addTo(map);
						} else {
							map.setView([lat, lon], 10);
						}
						L.marker([lat, lon]).addTo(map).bindPopup(destVal).openPopup();
					} else {
						alert("Location not found. Please try another destination.");
					}
				});
		});
	}
	function setupDateModal(overlay, addDate) {
		addDate.addEventListener("click", function () {
			let dateModal = createElement("div", ["custom-modal", "date-modal","container"], {});
			let header = createElement("h2", [], {}, "Add dates or Trip Length");
			let dateOptions = createElement("div", [], { id: "date-options" });
			let datesButton = createElement("button", [], {}, "Dates(MM/DD)");
			let tripLengthButton = createElement("button", [], {}, "Trip Length");
			dateOptions.appendChild(header);
			dateOptions.appendChild(datesButton);
			dateOptions.appendChild(tripLengthButton);
			dateModal.appendChild(dateOptions);
			let monthsDiv = createElement("div", [], { id: "months" });
			let backImg = createElement("img", [], { src: "../Assets/icons/back-svgrepo-com.svg" });
			let backButton = createElement("button", [], {});
			backButton.appendChild(backImg);
			let monthHeading = createElement("h4", [], {}, "Month");
			let nextImg = createElement("img", [], { src: "../Assets/icons/next-svgrepo-com.svg" });
			let nextButton = createElement("button", [], {});
			nextButton.appendChild(nextImg);
			monthsDiv.appendChild(backButton);
			monthsDiv.appendChild(monthHeading);
			monthsDiv.appendChild(nextButton);
			dateModal.appendChild(monthsDiv);
			let daysDiv = createElement("div", [], { id: "weekdays" });
			let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			days.forEach((day) => { 
				let dayButton = createElement("button", ["weekDaysBtn"], {}, day);
				daysDiv.appendChild(dayButton);
			});
			dateModal.appendChild(daysDiv);
			let hr = createElement("hr");
			dateModal.appendChild(hr);
			overlay.appendChild(dateModal);
		});
	}
		
});

let imageSelector = (destination, image) => {
	if (destination.textContent.toLowerCase() === "spain") {
		image.src = "../Assets/images/logan-armstrong-hVhfqhDYciU-unsplash.jpg";
	} else if (destination.textContent.toLowerCase() === "united kingdom") {
		image.src = "../Assets/images/marcin-nowak-iXqTqC-f6jI-unsplash.jpg";
	}
};
